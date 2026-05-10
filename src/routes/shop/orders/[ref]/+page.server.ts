import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { sql } from "$lib/server/db";

type ShippingAddress = {
  recipient: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
};

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.auth();
  if (!session?.user) throw redirect(303, "/shop");

  const [order] = await sql<
    {
      id: number;
      reference: string;
      user_id: string;
      type: "drop" | "pod";
      status: string;
      total: number;
      shipping_address: ShippingAddress | null;
      created_at: Date;
      paid_at: Date | null;
      ready_at: Date | null;
      shipped_at: Date | null;
      collected_at: Date | null;
      delivered_at: Date | null;
      cancelled_at: Date | null;
    }[]
  >`select * from orders where reference = ${params.ref}`;

  if (!order) throw error(404, "order not found");
  if (order.user_id !== session.user.id && !session.user.isAdmin) {
    throw error(403, "not your order");
  }

  const items = await sql<
    {
      qty: number;
      price_at_order: number;
      label: string;
      product_name: string;
    }[]
  >`
    select oi.qty, oi.price_at_order, v.label, p.name as product_name
    from order_items oi
    join variants v on v.id = oi.variant_id
    join products p on p.id = v.product_id
    where oi.order_id = ${order.id}
    order by oi.id
  `;

  const [drop] = order.type === "drop"
    ? await sql<{ collection_event: string | null; closes_at: Date }[]>`
        select d.collection_event, d.closes_at
        from drops d
        join products p on p.drop_id = d.id
        join variants v on v.product_id = p.id
        join order_items oi on oi.variant_id = v.id
        where oi.order_id = ${order.id}
        limit 1
      `
    : [];

  return {
    order,
    items,
    drop,
    bank: {
      sortCode: env.BANK_SORT_CODE ?? "",
      accountNumber: env.BANK_ACCOUNT_NUMBER ?? "",
      accountName: env.BANK_ACCOUNT_NAME ?? "",
    },
  };
};
