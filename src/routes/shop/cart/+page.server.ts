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
  stock_count: number | null;
  enabled: boolean;
  product_id: number;
  product_name: string;
  image_url: string | null;
  product_type: "drop" | "pod";
  drop_id: number | null;
  drop_slug: string | null;
  drop_name: string | null;
  drop_status: string | null;
  collection_event: string | null;
  opens_at: Date | null;
  closes_at: Date | null;
};

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  if (!session?.user) throw redirect(303, "/shop");

  const variants = await sql<VariantRow[]>`
    select
      v.id, v.options, v.price, v.stock_count, v.enabled,
      p.id as product_id, p.name as product_name, p.image_url,
      p.type as product_type, p.drop_id,
      d.slug as drop_slug, d.name as drop_name, d.status as drop_status,
      d.collection_event, d.opens_at, d.closes_at
    from variants v
    join products p on p.id = v.product_id
    left join drops d on d.id = p.drop_id
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
        v.id, v.options, v.price, v.stock_count, v.enabled,
        p.id as product_id, p.name as product_name, p.image_url,
        p.type as product_type, p.drop_id,
        d.slug as drop_slug, d.name as drop_name, d.status as drop_status,
        d.collection_event, d.opens_at, d.closes_at
      from variants v
      join products p on p.id = v.product_id
      left join drops d on d.id = p.drop_id
      where v.id in ${sql(variantIds)}
    `;
    const variantMap = new Map(rows.map((v) => [v.id, v]));

    const now = new Date();
    for (const it of items) {
      const v = variantMap.get(it.variant_id);
      if (!v) return fail(400, { error: `variant ${it.variant_id} not found` });
      if (!v.enabled) {
        return fail(400, {
          error: `${v.product_name} is no longer available — remove from basket`,
        });
      }
      if (v.product_type === "drop") {
        if (
          v.drop_status !== "open" ||
          (v.opens_at && v.opens_at > now) ||
          (v.closes_at && v.closes_at <= now)
        ) {
          return fail(400, {
            error: `${v.product_name} is not currently available`,
          });
        }
      }
      if (v.stock_count != null && it.qty > v.stock_count) {
        return fail(400, {
          error: `only ${v.stock_count} of ${v.product_name} left`,
        });
      }
    }

    const hasPOD = items.some(
      (it) => variantMap.get(it.variant_id)!.product_type === "pod",
    );
    let shippingAddress: ShippingAddress | null = null;
    if (hasPOD) {
      const recipient = String(data.get("recipient") ?? "").trim();
      const line1 = String(data.get("line1") ?? "").trim();
      const line2 = String(data.get("line2") ?? "").trim();
      const city = String(data.get("city") ?? "").trim();
      const postcode = String(data.get("postcode") ?? "").trim();
      const country = String(data.get("country") ?? "United Kingdom").trim();
      if (!recipient || !line1 || !city || !postcode) {
        return fail(400, {
          error: "shipping address is required for direct-order items",
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

    const groups = new Map<number | "pod", typeof items>();
    for (const it of items) {
      const v = variantMap.get(it.variant_id)!;
      const key = v.product_type === "pod" ? ("pod" as const) : v.drop_id!;
      const g = groups.get(key) ?? [];
      g.push(it);
      groups.set(key, g);
    }

    const refs: string[] = [];
    for (const [groupKey, groupItems] of groups) {
      const type: "drop" | "pod" = groupKey === "pod" ? "pod" : "drop";
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
        items: orderItems,
        shippingAddress: type === "pod" ? shippingAddress : null,
      });
      refs.push(order.reference);

      if (session.user.email) {
        const first = variantMap.get(groupItems[0].variant_id)!;
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
            collection_event: type === "drop" ? first.collection_event : null,
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
