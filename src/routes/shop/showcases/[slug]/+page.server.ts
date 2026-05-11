import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.auth();
  if (!session?.user) throw redirect(303, "/shop");

  const [showcase] = await sql<
    {
      id: number;
      slug: string;
      name: string;
      description: string | null;
      kind: "drop" | "always_on";
      opens_at: Date | null;
      closes_at: Date | null;
      status: string;
    }[]
  >`
    select id, slug, name, description, kind, opens_at, closes_at, status
    from showcases where slug = ${params.slug}
  `;
  if (!showcase) throw error(404, "showcase not found");

  const products = await sql<
    {
      id: number;
      name: string;
      description: string | null;
      image_url: string | null;
      price: number;
    }[]
  >`
    select p.id, p.name, p.description, p.image_url, p.price
    from products p
    join showcase_products sp on sp.product_id = p.id
    where sp.showcase_id = ${showcase.id}
    order by sp.display_order, p.id
  `;

  const productIds = products.map((p) => p.id);
  const variants = productIds.length
    ? await sql<
        {
          id: number;
          product_id: number;
          options: Record<string, string>;
        }[]
      >`
        select id, product_id, options
        from variants
        where product_id in ${sql(productIds)}
        order by product_id, display_order, id
      `
    : [];

  const now = new Date();
  const isOpen =
    showcase.status === "open" &&
    (showcase.opens_at == null || showcase.opens_at <= now) &&
    (showcase.closes_at == null || showcase.closes_at > now);

  return { showcase, products, variants, isOpen };
};
