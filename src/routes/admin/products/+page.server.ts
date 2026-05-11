import type { PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

export const load: PageServerLoad = async () => {
  const products = await sql<
    {
      id: number;
      name: string;
      description: string | null;
      image_url: string | null;
      variant_count: number;
      showcase_count: number;
    }[]
  >`
    select p.id, p.name, p.description, p.image_url,
           (select count(*)::int from variants v where v.product_id = p.id) as variant_count,
           (select count(*)::int from showcase_products sp where sp.product_id = p.id) as showcase_count
    from products p
    order by p.display_order, p.id
  `;
  return { products };
};
