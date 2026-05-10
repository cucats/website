import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "$lib/server/db";
import { variantLabel } from "$lib/utils";

function csvCell(v: string | number | null | undefined): string {
  const s = v == null ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export const GET: RequestHandler = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) throw error(404, "not found");

  const [drop] = await sql<{ id: number; slug: string }[]>`
    select id, slug from drops where id = ${id}
  `;
  if (!drop) throw error(404, "drop not found");

  const rows = await sql<
    {
      product_name: string;
      options: Record<string, string>;
      paid_qty: number;
      pending_qty: number;
      total_qty: number;
    }[]
  >`
    select
      p.name as product_name,
      v.options,
      coalesce(sum(case when o.status in ('paid','ready','collected') then oi.qty end), 0)::int as paid_qty,
      coalesce(sum(case when o.status = 'pending' then oi.qty end), 0)::int as pending_qty,
      coalesce(sum(case when o.status not in ('cancelled') then oi.qty end), 0)::int as total_qty
    from products p
    join variants v on v.product_id = p.id
    left join order_items oi on oi.variant_id = v.id
    left join orders o on o.id = oi.order_id
    where p.drop_id = ${id}
    group by p.id, p.name, v.id, v.options
    order by p.name, v.id
  `;

  const header = ["product", "variant", "paid_qty", "pending_qty", "total_qty"];
  const body = rows.map((r) =>
    [r.product_name, variantLabel(r.options), r.paid_qty, r.pending_qty, r.total_qty]
      .map(csvCell)
      .join(","),
  );
  const csv = [header.join(","), ...body].join("\n") + "\n";

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="drop-${drop.slug}-quantities.csv"`,
    },
  });
};
