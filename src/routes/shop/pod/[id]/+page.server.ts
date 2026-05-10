import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.auth();
  if (!session?.user) throw redirect(303, "/shop");

  const id = Number(params.id);
  if (!Number.isFinite(id)) throw error(404, "not found");

  const [product] = await sql<
    {
      id: number;
      name: string;
      description: string | null;
      image_url: string | null;
    }[]
  >`select id, name, description, image_url from products where id = ${id} and type = 'pod'`;
  if (!product) throw error(404, "not found");

  const variants = await sql<
    {
      id: number;
      options: Record<string, string>;
      price: number;
      stock_count: number | null;
    }[]
  >`
    select id, options, price, stock_count
    from variants
    where product_id = ${id}
    order by id
  `;
  return { product, variants };
};
