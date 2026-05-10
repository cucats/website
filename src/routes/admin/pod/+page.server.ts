import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { saveUpload } from "$lib/server/uploads";

export const load: PageServerLoad = async () => {
  const products = await sql<
    { id: number; name: string; image_url: string | null }[]
  >`
    select id, name, image_url
    from products
    where type = 'pod'
    order by id desc
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
      insert into products (drop_id, type, name, description, image_url)
      values (null, 'pod', ${name}, ${description || null}, ${image_url})
      returning id
    `;
    throw redirect(303, `/admin/pod/${row.id}`);
  },
};
