import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { saveUpload } from "$lib/server/uploads";
import { swapDisplayOrder } from "$lib/server/products";

export const load: PageServerLoad = async () => {
  const products = await sql<
    { id: number; name: string; image_url: string | null; display_order: number }[]
  >`
    select id, name, image_url, display_order
    from products
    where type = 'pod'
    order by display_order, id
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
      insert into products (drop_id, type, name, description, image_url, display_order)
      values (
        null, 'pod', ${name}, ${description || null}, ${image_url},
        coalesce((select max(display_order) + 1 from products where type = 'pod'), 0)
      )
      returning id
    `;
    throw redirect(303, `/admin/pod/${row.id}`);
  },
  moveUp: async ({ request }) => {
    const data = await request.formData();
    const id = Number(data.get("product_id"));
    if (Number.isFinite(id)) await swapDisplayOrder(id, "up");
    return { ok: true };
  },
  moveDown: async ({ request }) => {
    const data = await request.formData();
    const id = Number(data.get("product_id"));
    if (Number.isFinite(id)) await swapDisplayOrder(id, "down");
    return { ok: true };
  },
};
