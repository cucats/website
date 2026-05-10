import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.auth();
  if (!session?.user) throw redirect(303, "/shop");

  const [drop] = await sql<
    {
      id: number;
      slug: string;
      name: string;
      description: string | null;
      opens_at: Date;
      closes_at: Date;
      collection_event: string | null;
      status: string;
    }[]
  >`select * from drops where slug = ${params.slug}`;
  if (!drop) throw error(404, "drop not found");

  const products = await sql<
    {
      id: number;
      name: string;
      description: string | null;
      image_url: string | null;
    }[]
  >`select id, name, description, image_url from products where drop_id = ${drop.id} order by display_order, id`;

  const productIds = products.map((p) => p.id);
  const variants = productIds.length
    ? await sql<
        {
          id: number;
          product_id: number;
          options: Record<string, string>;
          price: number;
          stock_count: number | null;
        }[]
      >`
        select id, product_id, options, price, stock_count
        from variants
        where product_id in ${sql(productIds)} and enabled
        order by product_id, display_order, id
      `
    : [];

  const now = new Date();
  const isOpen =
    drop.status === "open" && drop.opens_at <= now && drop.closes_at > now;

  return { drop, products, variants, isOpen };
};
