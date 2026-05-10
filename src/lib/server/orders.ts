import { sql } from "$lib/server/db";

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function generateReference(): string {
  const buf = new Uint8Array(6);
  crypto.getRandomValues(buf);
  let out = "CUCATS-";
  for (const b of buf) out += CROCKFORD[b % 32];
  return out;
}

export type OrderItem = {
  variant_id: number;
  qty: number;
  price: number;
};

export type ShippingAddress = {
  recipient: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
};

export type CreateOrderInput = {
  userId: string;
  type: "drop" | "pod";
  showcaseId: number;
  items: OrderItem[];
  shippingAddress?: ShippingAddress | null;
};

export async function createOrder(
  input: CreateOrderInput,
): Promise<{ id: number; reference: string; total: number }> {
  if (input.items.length === 0) throw new Error("no items");
  const total = input.items.reduce((s, it) => s + it.qty * it.price, 0);

  const shipping = input.shippingAddress
    ? JSON.stringify(input.shippingAddress)
    : null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const reference = generateReference();
    try {
      const result = await sql.begin(async (tx) => {
        const [order] = await tx<{ id: number; reference: string }[]>`
          insert into orders
            (reference, user_id, type, showcase_id, total, shipping_address)
          values
            (${reference}, ${input.userId}, ${input.type}, ${input.showcaseId},
             ${total}, ${shipping}::jsonb)
          returning id, reference
        `;
        for (const it of input.items) {
          await tx`
            insert into order_items (order_id, variant_id, qty, price_at_order)
            values (${order.id}, ${it.variant_id}, ${it.qty}, ${it.price})
          `;
        }
        return order;
      });
      return { ...result, total: total };
    } catch (err) {
      if ((err as { code?: string }).code === "23505") continue;
      throw err;
    }
  }
  throw new Error("could not allocate unique reference");
}
