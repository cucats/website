import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { parseOptions } from "$lib/utils";

export const load: PageServerLoad = async ({ params }) => {
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

export const actions: Actions = {
  update: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const name = String(data.get("name") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    if (!name) return fail(400, { error: "name required" });
    await sql`
      update products set
        name = ${name},
        description = ${description || null}
      where id = ${id}
    `;
    return { ok: true };
  },
  destroy: async ({ params }) => {
    const id = Number(params.id);
    await sql`delete from products where id = ${id}`;
    throw redirect(303, "/admin/pod");
  },
  addVariant: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const optionsStr = String(data.get("options") ?? "").trim();
    const options = parseOptions(optionsStr);
    const price = Number(data.get("price"));
    const stock_raw = String(data.get("stock_count") ?? "").trim();
    const stock_count = stock_raw === "" ? null : Number(stock_raw);
    if (!Number.isFinite(price) || price < 0) {
      return fail(400, { error: "bad variant fields" });
    }
    await sql`
      insert into variants (product_id, options, price, stock_count)
      values (${id}, ${JSON.stringify(options)}::jsonb, ${price}, ${stock_count})
    `;
    return { ok: true };
  },
  deleteVariant: async ({ request }) => {
    const data = await request.formData();
    const vid = Number(data.get("variant_id"));
    if (!Number.isFinite(vid)) return fail(400, { error: "bad variant id" });
    await sql`delete from variants where id = ${vid}`;
    return { ok: true };
  },
};
