import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  if (!session?.user) throw redirect(303, "/shop");

  const products = await sql<
    {
      id: number;
      name: string;
      description: string | null;
      image_url: string | null;
      min_price_pence: number | null;
      max_price_pence: number | null;
    }[]
  >`
    select p.id, p.name, p.description, p.image_url,
           min(v.price_pence) as min_price_pence,
           max(v.price_pence) as max_price_pence
    from products p
    left join variants v on v.product_id = p.id
    where p.type = 'pod'
    group by p.id
    order by p.id desc
  `;
  return { products };
};
