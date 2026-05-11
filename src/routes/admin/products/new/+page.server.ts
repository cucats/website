import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { sql } from "$lib/server/db";
import { saveUpload } from "$lib/server/uploads";

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const title = String(data.get("title") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    if (!title) return fail(400, { error: "title required", title, description });
    const file = data.get("image");
    let image_url: string | null = null;
    if (file instanceof File && file.size > 0) {
      try {
        image_url = await saveUpload(file);
      } catch (err) {
        return fail(400, {
          error: `image: ${(err as Error).message}`,
          title,
          description,
        });
      }
    }
    const [row] = await sql<{ id: number }[]>`
      insert into products (name, description, image_url, display_order)
      values (
        ${title}, ${description || null}, ${image_url},
        coalesce((select max(display_order) + 1 from products), 0)
      )
      returning id
    `;
    throw redirect(303, `/admin/products/${row.id}`);
  },
};
