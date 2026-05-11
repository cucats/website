import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { createOrder, type ShippingAddress } from "$lib/server/orders";
import { sendOrderConfirmation } from "$lib/server/email";
import { variantLabel } from "$lib/utils";

type VariantRow = {
  id: number;
  options: Record<string, string>;
  price: number;
  product_id: number;
  product_name: string;
  image_url: string | null;
  showcase_id: number;
  showcase_slug: string;
  showcase_name: string;
  showcase_kind: "drop" | "always_on";
  showcase_status: string;
  showcase_opens_at: Date | null;
  showcase_closes_at: Date | null;
};

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  if (!session?.user) throw redirect(303, "/shop");

  const variants = await sql<VariantRow[]>`
    select
      v.id, v.options,
      p.id as product_id, p.name as product_name, p.image_url, p.price,
      s.id as showcase_id, s.slug as showcase_slug, s.name as showcase_name,
      s.kind as showcase_kind, s.status as showcase_status,
      s.opens_at as showcase_opens_at, s.closes_at as showcase_closes_at
    from variants v
    join products p on p.id = v.product_id
    join showcase_products sp on sp.product_id = p.id
    join showcases s on s.id = sp.showcase_id
  `;

  return { variants };
};

export const actions: Actions = {
  checkout: async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session?.user) return fail(401, { error: "not signed in" });

    const data = await request.formData();

    const items: { variant_id: number; qty: number }[] = [];
    for (const [key, raw] of data.entries()) {
      if (!key.startsWith("qty_")) continue;
      const vid = Number(key.slice(4));
      const qty = Number(raw);
      if (!Number.isFinite(vid) || !Number.isFinite(qty) || qty <= 0) continue;
      if (!Number.isInteger(qty)) {
        return fail(400, { error: "quantities must be whole numbers" });
      }
      items.push({ variant_id: vid, qty });
    }
    if (items.length === 0) return fail(400, { error: "cart is empty" });

    const variantIds = items.map((i) => i.variant_id);
    const rows = await sql<VariantRow[]>`
      select
        v.id, v.options,
        p.id as product_id, p.name as product_name, p.image_url, p.price,
        s.id as showcase_id, s.slug as showcase_slug, s.name as showcase_name,
        s.kind as showcase_kind, s.status as showcase_status,
        s.opens_at as showcase_opens_at, s.closes_at as showcase_closes_at
      from variants v
      join products p on p.id = v.product_id
      join showcase_products sp on sp.product_id = p.id
      join showcases s on s.id = sp.showcase_id
      where v.id in ${sql(variantIds)}
    `;
    const variantMap = new Map<number, VariantRow>();
    for (const r of rows) {
      if (!variantMap.has(r.id)) variantMap.set(r.id, r);
    }

    const now = new Date();
    for (const it of items) {
      const v = variantMap.get(it.variant_id);
      if (!v) return fail(400, { error: `variant ${it.variant_id} not found` });
      if (v.showcase_status !== "open") {
        return fail(400, {
          error: `${v.product_name} is not currently available`,
        });
      }
      if (v.showcase_opens_at && v.showcase_opens_at > now) {
        return fail(400, { error: `${v.product_name} isn't open yet` });
      }
      if (v.showcase_closes_at && v.showcase_closes_at <= now) {
        return fail(400, { error: `${v.product_name} is closed` });
      }
    }

    const hasShippedItem = items.some(
      (it) => variantMap.get(it.variant_id)!.showcase_kind === "always_on",
    );
    let shippingAddress: ShippingAddress | null = null;
    if (hasShippedItem) {
      const recipient = String(data.get("recipient") ?? "").trim();
      const line1 = String(data.get("line1") ?? "").trim();
      const line2 = String(data.get("line2") ?? "").trim();
      const city = String(data.get("city") ?? "").trim();
      const postcode = String(data.get("postcode") ?? "").trim();
      const country = String(data.get("country") ?? "United Kingdom").trim();
      if (!recipient || !line1 || !city || !postcode) {
        return fail(400, {
          error: "shipping address is required for direct-ship items",
        });
      }
      shippingAddress = {
        recipient,
        line1,
        line2: line2 || undefined,
        city,
        postcode,
        country,
      };
    }

    const groups = new Map<number, typeof items>();
    for (const it of items) {
      const v = variantMap.get(it.variant_id)!;
      const g = groups.get(v.showcase_id) ?? [];
      g.push(it);
      groups.set(v.showcase_id, g);
    }

    const refs: string[] = [];
    for (const [showcaseId, groupItems] of groups) {
      const first = variantMap.get(groupItems[0].variant_id)!;
      const type: "drop" | "pod" =
        first.showcase_kind === "drop" ? "drop" : "pod";
      const orderItems = groupItems.map((it) => {
        const v = variantMap.get(it.variant_id)!;
        return {
          variant_id: it.variant_id,
          qty: it.qty,
          price: v.price,
        };
      });
      const order = await createOrder({
        userId: session.user.id,
        type,
        showcaseId,
        items: orderItems,
        shippingAddress: type === "pod" ? shippingAddress : null,
      });
      refs.push(order.reference);

      if (session.user.email) {
        try {
          await sendOrderConfirmation({
            to: session.user.email,
            reference: order.reference,
            type,
            items: orderItems.map((oi) => {
              const v = variantMap.get(oi.variant_id)!;
              return {
                name: v.product_name,
                label: variantLabel(v.options),
                qty: oi.qty,
                price: oi.price,
              };
            }),
            total: order.total,
            status_url: `${new URL(request.url).origin}/shop/orders/${order.reference}`,
          });
        } catch (err) {
          console.error("email send failed", err);
        }
      }
    }

    if (refs.length === 1) throw redirect(303, `/shop/orders/${refs[0]}`);
    throw redirect(303, "/shop/orders");
  },
};
