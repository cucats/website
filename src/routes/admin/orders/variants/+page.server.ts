import type { PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

type Row = {
  product_id: number;
  product_name: string;
  options: Record<string, string>;
  pending_qty: number;
  paid_qty: number;
  ready_qty: number;
  shipped_qty: number;
  collected_qty: number;
  delivered_qty: number;
  cancelled_qty: number;
};

export const load: PageServerLoad = async ({ url }) => {
  const showcaseRaw = url.searchParams.get("showcase");
  const showcaseId = showcaseRaw ? Number(showcaseRaw) : null;

  const showcases = await sql<
    { id: number; name: string; kind: string }[]
  >`
    select id, name, kind from showcases
    order by case kind when 'always_on' then 0 else 1 end, name
  `;

  const rows = await sql<Row[]>`
    select
      p.id as product_id,
      p.name as product_name,
      v.options,
      coalesce(sum(case when o.status = 'pending'   then oi.qty end), 0)::int as pending_qty,
      coalesce(sum(case when o.status = 'paid'      then oi.qty end), 0)::int as paid_qty,
      coalesce(sum(case when o.status = 'ready'     then oi.qty end), 0)::int as ready_qty,
      coalesce(sum(case when o.status = 'shipped'   then oi.qty end), 0)::int as shipped_qty,
      coalesce(sum(case when o.status = 'collected' then oi.qty end), 0)::int as collected_qty,
      coalesce(sum(case when o.status = 'delivered' then oi.qty end), 0)::int as delivered_qty,
      coalesce(sum(case when o.status = 'cancelled' then oi.qty end), 0)::int as cancelled_qty
    from order_items oi
    join orders o on o.id = oi.order_id
    join variants v on v.id = oi.variant_id
    join products p on p.id = v.product_id
    where (${showcaseId}::int is null or o.showcase_id = ${showcaseId})
    group by p.id, p.name, v.id, v.options, v.display_order
    order by p.name, v.display_order, v.id
  `;

  return { rows, showcases, filters: { showcaseId } };
};
