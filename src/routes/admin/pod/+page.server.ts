import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { saveUpload } from "$lib/server/uploads";

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

async function swapOrder(id: number, direction: "up" | "down") {
  await sql.begin(async (tx) => {
    const [current] = await tx<{ display_order: number; type: string }[]>`
      select display_order, type from products where id = ${id}
    `;
    if (!current) return;
    const neighbour = direction === "up"
      ? await tx<{ id: number; display_order: number }[]>`
          select id, display_order from products
          where type = ${current.type}
            and (display_order, id) < (${current.display_order}, ${id})
          order by display_order desc, id desc
          limit 1
        `
      : await tx<{ id: number; display_order: number }[]>`
          select id, display_order from products
          where type = ${current.type}
            and (display_order, id) > (${current.display_order}, ${id})
          order by display_order asc, id asc
          limit 1
        `;
    if (neighbour.length === 0) return;
    const other = neighbour[0];
    await tx`update products set display_order = ${other.display_order} where id = ${id}`;
    await tx`update products set display_order = ${current.display_order} where id = ${other.id}`;
  });
}

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
    if (Number.isFinite(id)) await swapOrder(id, "up");
    return { ok: true };
  },
  moveDown: async ({ request }) => {
    const data = await request.formData();
    const id = Number(data.get("product_id"));
    if (Number.isFinite(id)) await swapOrder(id, "down");
    return { ok: true };
  },
};
