import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { createOrder } from "$lib/server/orders";
import { sendOrderConfirmation } from "$lib/server/email";
import { variantLabel } from "$lib/utils";

export const load: PageServerLoad = async ({ params, locals, url }) => {
  const session = await locals.auth();
  if (!session?.user) throw redirect(303, "/shop");

  const [drop] = await sql<
    {
      id: number;
      slug: string;
      name: string;
      description: string | null;
      opens_at: Date;
      closes_at: Date;
      collection_event: string | null;
      status: string;
    }[]
  >`select * from drops where slug = ${params.slug}`;
  if (!drop) throw error(404, "drop not found");

  const products = await sql<
    {
      id: number;
      name: string;
      description: string | null;
      image_url: string | null;
    }[]
  >`select id, name, description, image_url from products where drop_id = ${drop.id} order by display_order, id`;

  const productIds = products.map((p) => p.id);
  const variants = productIds.length
    ? await sql<
        {
          id: number;
          product_id: number;
          options: Record<string, string>;
          price: number;
          stock_count: number | null;
        }[]
      >`
        select id, product_id, options, price, stock_count
        from variants
        where product_id in ${sql(productIds)}
        order by id
      `
    : [];

  const now = new Date();
  const isOpen =
    drop.status === "open" && drop.opens_at <= now && drop.closes_at > now;

  return { drop, products, variants, isOpen, signinReturn: url.pathname };
};

export const actions: Actions = {
  order: async ({ request, locals, params }) => {
    const session = await locals.auth();
    if (!session?.user) return fail(401, { error: "not signed in" });

    const [drop] = await sql<
      { id: number; status: string; opens_at: Date; closes_at: Date; collection_event: string | null }[]
    >`select id, status, opens_at, closes_at, collection_event from drops where slug = ${params.slug}`;
    if (!drop) return fail(404, { error: "drop not found" });

    const now = new Date();
    if (drop.status !== "open" || drop.opens_at > now || drop.closes_at <= now) {
      return fail(400, { error: "this drop is not open for orders" });
    }

    const data = await request.formData();
    const variantRows = await sql<
      {
        id: number;
        product_id: number;
        options: Record<string, string>;
        price: number;
        stock_count: number | null;
        product_name: string;
      }[]
    >`
      select v.id, v.product_id, v.options, v.price, v.stock_count,
             p.name as product_name
      from variants v
      join products p on p.id = v.product_id
      where p.drop_id = ${drop.id}
    `;

    const items: {
      variant_id: number;
      qty: number;
      price: number;
      name: string;
      label: string;
    }[] = [];
    for (const v of variantRows) {
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
    if (items.length === 0) {
      return fail(400, { error: "select at least one item" });
    }

    const order = await createOrder({
      userId: session.user.id,
      type: "drop",
      items: items.map((i) => ({
        variant_id: i.variant_id,
        qty: i.qty,
        price: i.price,
      })),
    });

    if (session.user.email) {
      try {
        await sendOrderConfirmation({
          to: session.user.email,
          reference: order.reference,
          type: "drop",
          items,
          total: order.total,
          collection_event: drop.collection_event,
          status_url: `${new URL(request.url).origin}/shop/orders/${order.reference}`,
        });
      } catch (err) {
        console.error("email send failed", err);
      }
    }

    throw redirect(303, `/shop/orders/${order.reference}`);
  },
};
