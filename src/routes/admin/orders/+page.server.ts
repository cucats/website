import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { STATUSES, type OrderStatus } from "./statuses";

type OrderRow = {
  id: number;
  reference: string;
  type: string;
  status: OrderStatus;
  total: number;
  created_at: Date;
  user_email: string;
  showcase_id: number;
  showcase_name: string;
  showcase_slug: string;
};

type OrderItemRow = {
  order_id: number;
  qty: number;
  price_at_order: number;
  options: Record<string, string>;
  product_name: string;
};

export const load: PageServerLoad = async ({ url }) => {
  const status = url.searchParams.get("status");
  const showcaseRaw = url.searchParams.get("showcase");
  const showcaseId = showcaseRaw ? Number(showcaseRaw) : null;

  const showcases = await sql<
    { id: number; name: string; kind: string }[]
  >`
    select id, name, kind from showcases
    order by case kind when 'always_on' then 0 else 1 end, name
  `;

  const orders = await sql<OrderRow[]>`
    select o.id, o.reference, o.type, o.status, o.total, o.created_at,
           u.email as user_email,
           s.id as showcase_id, s.name as showcase_name, s.slug as showcase_slug
    from orders o
    join users u on u.id = o.user_id
    join showcases s on s.id = o.showcase_id
    where (${status}::text is null or o.status = ${status})
      and (${showcaseId}::int is null or o.showcase_id = ${showcaseId})
    order by o.created_at desc
    limit 500
  `;

  const orderIds = orders.map((o) => o.id);
  const items = orderIds.length
    ? await sql<OrderItemRow[]>`
        select oi.order_id, oi.qty, oi.price_at_order, v.options, p.name as product_name
        from order_items oi
        join variants v on v.id = oi.variant_id
        join products p on p.id = v.product_id
        where oi.order_id in ${sql(orderIds)}
        order by oi.id
      `
    : [];

  return {
    orders,
    items,
    showcases,
    filters: { status, showcaseId },
  };
};

export const actions: Actions = {
  setStatus: async ({ request }) => {
    const data = await request.formData();
    const id = Number(data.get("order_id"));
    const status = String(data.get("status") ?? "");
    if (!Number.isFinite(id)) return fail(400, { error: "bad order id" });
    if (!STATUSES.includes(status as OrderStatus)) {
      return fail(400, { error: "bad status" });
    }
    await sql`
      update orders set
        status = ${status},
        paid_at      = case when ${status} = 'paid'      and paid_at      is null then now() else paid_at      end,
        ready_at     = case when ${status} = 'ready'     and ready_at     is null then now() else ready_at     end,
        shipped_at   = case when ${status} = 'shipped'   and shipped_at   is null then now() else shipped_at   end,
        collected_at = case when ${status} = 'collected' and collected_at is null then now() else collected_at end,
        delivered_at = case when ${status} = 'delivered' and delivered_at is null then now() else delivered_at end,
        cancelled_at = case when ${status} = 'cancelled' and cancelled_at is null then now() else cancelled_at end
      where id = ${id}
    `;
    return { ok: true };
  },
};
