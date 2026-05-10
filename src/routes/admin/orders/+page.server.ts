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
      total_pence: number;
      created_at: Date;
      bank_reference: string | null;
      user_email: string;
    }[]
  >`
    select o.id, o.reference, o.type, o.status, o.total_pence, o.created_at,
           o.bank_reference, u.email as user_email
    from orders o
    join users u on u.id = o.user_id
    where (${status}::text is null or o.status = ${status})
      and (${type}::text is null or o.type = ${type})
    order by o.created_at desc
    limit 500
  `;

  return { orders, filters: { status, type } };
};

async function transition(
  id: number,
  action: keyof typeof TRANSITIONS,
  bankReference: string | null,
) {
  const t = TRANSITIONS[action];
  if (action === "markPaid") {
    await sql`
      update orders set
        paid_at = now(),
        status = 'paid',
        bank_reference = coalesce(${bankReference}, bank_reference)
      where id = ${id}
    `;
    return;
  }
  await sql.unsafe(
    `update orders set ${t.col} = now(), status = $1 where id = $2`,
    [t.status, id],
  );
}

export const actions: Actions = {
  ...Object.fromEntries(
    Object.keys(TRANSITIONS).map((action) => [
      action,
      async ({ request }: { request: Request }) => {
        const data = await request.formData();
        const id = Number(data.get("order_id"));
        if (!Number.isFinite(id)) return fail(400, { error: "bad order id" });
        const bankRef =
          action === "markPaid"
            ? String(data.get("bank_reference") ?? "").trim() || null
            : null;
        await transition(id, action as keyof typeof TRANSITIONS, bankRef);
        return { ok: true };
      },
    ]),
  ),
};
