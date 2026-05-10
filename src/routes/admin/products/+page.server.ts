import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { saveUpload } from "$lib/server/uploads";

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

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const name = String(data.get("name") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    if (!name) return fail(400, { error: "name required" });
    const file = data.get("image");
    let image_url: string | null = null;
    if (file instanceof File && file.size > 0) {
      try {
        image_url = await saveUpload(file);
      } catch (err) {
        return fail(400, { error: `image: ${(err as Error).message}` });
      }
    }
    const [row] = await sql<{ id: number }[]>`
      insert into products (name, description, image_url, display_order)
      values (
        ${name}, ${description || null}, ${image_url},
        coalesce((select max(display_order) + 1 from products), 0)
      )
      returning id
    `;
    throw redirect(303, `/admin/products/${row.id}`);
  },
};
