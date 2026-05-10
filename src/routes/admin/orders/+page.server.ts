import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

export const STATUSES = [
  "pending",
  "paid",
  "ready",
  "shipped",
  "collected",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof STATUSES)[number];

export const load: PageServerLoad = async ({ url }) => {
  const status = url.searchParams.get("status");
  const type = url.searchParams.get("type");

  const orders = await sql<
    {
      id: number;
      reference: string;
      type: string;
      status: OrderStatus;
      total: number;
      created_at: Date;
      user_email: string;
    }[]
  >`
    select o.id, o.reference, o.type, o.status, o.total, o.created_at,
           u.email as user_email
    from orders o
    join users u on u.id = o.user_id
    where (${status}::text is null or o.status = ${status})
      and (${type}::text is null or o.type = ${type})
    order by o.created_at desc
    limit 500
  `;

  return { orders, filters: { status, type } };
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
