import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { createOrder, type ShippingAddress } from "$lib/server/orders";
import { sendOrderConfirmation } from "$lib/server/email";
import { variantLabel } from "$lib/utils";

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.auth();
  if (!session?.user) throw redirect(303, "/shop");

  const id = Number(params.id);
  if (!Number.isFinite(id)) throw error(404, "not found");

  const [product] = await sql<
    {
      id: number;
      name: string;
      description: string | null;
      image_url: string | null;
    }[]
  >`select id, name, description, image_url from products where id = ${id} and type = 'pod'`;
  if (!product) throw error(404, "not found");

  const variants = await sql<
    {
      id: number;
      options: Record<string, string>;
      price: number;
      stock_count: number | null;
    }[]
  >`
    select id, options, price, stock_count
    from variants
    where product_id = ${id}
    order by id
  `;
  return { product, variants };
};

export const actions: Actions = {
  order: async ({ request, locals, params }) => {
    const session = await locals.auth();
    if (!session?.user) return fail(401, { error: "not signed in" });
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail(404, { error: "not found" });

    const variants = await sql<
      {
        id: number;
        options: Record<string, string>;
        price: number;
        stock_count: number | null;
        product_name: string;
      }[]
    >`
      select v.id, v.options, v.price, v.stock_count, p.name as product_name
      from variants v
      join products p on p.id = v.product_id
      where v.product_id = ${id} and p.type = 'pod'
    `;
    if (variants.length === 0) return fail(400, { error: "no variants available" });

    const data = await request.formData();

    const items: {
      variant_id: number;
      qty: number;
      price: number;
      name: string;
      label: string;
    }[] = [];
    for (const v of variants) {
      const raw = data.get(`qty_${v.id}`);
      if (raw == null) continue;
      const qty = Number(raw);
      if (!Number.isFinite(qty) || qty <= 0) continue;
      if (!Number.isInteger(qty)) return fail(400, { error: "quantities must be whole numbers" });
      const label = variantLabel(v.options);
      if (v.stock_count != null && qty > v.stock_count) {
        return fail(400, { error: `only ${v.stock_count} of ${v.product_name} (${label}) left` });
      }
      items.push({
        variant_id: v.id,
        qty,
        price: v.price,
        name: v.product_name,
        label,
      });
    }
    if (items.length === 0) return fail(400, { error: "select at least one item" });

    const recipient = String(data.get("recipient") ?? "").trim();
    const line1 = String(data.get("line1") ?? "").trim();
    const line2 = String(data.get("line2") ?? "").trim();
    const city = String(data.get("city") ?? "").trim();
    const postcode = String(data.get("postcode") ?? "").trim();
    const country = String(data.get("country") ?? "United Kingdom").trim();
    if (!recipient || !line1 || !city || !postcode) {
      return fail(400, { error: "shipping address is required" });
    }
    const shippingAddress: ShippingAddress = {
      recipient,
      line1,
      line2: line2 || undefined,
      city,
      postcode,
      country,
    };

    const order = await createOrder({
      userId: session.user.id,
      type: "pod",
      items: items.map((i) => ({
        variant_id: i.variant_id,
        qty: i.qty,
        price: i.price,
      })),
      shippingAddress,
    });

    if (session.user.email) {
      try {
        await sendOrderConfirmation({
          to: session.user.email,
          reference: order.reference,
          type: "pod",
          items,
          total: order.total,
          status_url: `${new URL(request.url).origin}/shop/orders/${order.reference}`,
        });
      } catch (err) {
        console.error("email send failed", err);
      }
    }

    throw redirect(303, `/shop/orders/${order.reference}`);
  },
};
