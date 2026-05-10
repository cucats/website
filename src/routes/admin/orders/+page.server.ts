import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

const TRANSITIONS: Record<string, { col: string; status: string }> = {
  markPaid: { col: "paid_at", status: "paid" },
  markReady: { col: "ready_at", status: "ready" },
  markShipped: { col: "shipped_at", status: "shipped" },
  markCollected: { col: "collected_at", status: "collected" },
  markDelivered: { col: "delivered_at", status: "delivered" },
  cancel: { col: "cancelled_at", status: "cancelled" },
};

export const load: PageServerLoad = async ({ url }) => {
  const status = url.searchParams.get("status");
  const type = url.searchParams.get("type");

  const orders = await sql<
    {
      id: number;
      reference: string;
      type: string;
      status: string;
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

async function transition(id: number, action: keyof typeof TRANSITIONS) {
  const t = TRANSITIONS[action];
  await sql.unsafe(
    `update orders set ${t.col} = now(), status = $1 where id = $2`,
    [t.status, id],
  );
}

async function restore(id: number) {
  await sql`
    update orders
    set status = 'pending',
        cancelled_at = null,
        paid_at = null,
        ready_at = null,
        shipped_at = null,
        collected_at = null,
        delivered_at = null
    where id = ${id} and status = 'cancelled'
  `;
}

export const actions: Actions = {
  ...Object.fromEntries(
    Object.keys(TRANSITIONS).map((action) => [
      action,
      async ({ request }: { request: Request }) => {
        const data = await request.formData();
        const id = Number(data.get("order_id"));
        if (!Number.isFinite(id)) return fail(400, { error: "bad order id" });
        await transition(id, action as keyof typeof TRANSITIONS);
        return { ok: true };
      },
    ]),
  ),
  restore: async ({ request }) => {
    const data = await request.formData();
    const id = Number(data.get("order_id"));
    if (!Number.isFinite(id)) return fail(400, { error: "bad order id" });
    await restore(id);
    return { ok: true };
  },
};
