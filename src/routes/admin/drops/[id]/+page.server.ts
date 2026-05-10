import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { saveUpload } from "$lib/server/uploads";

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) throw error(404, "not found");

  const [drop] = await sql<
    {
      id: number;
      slug: string;
      name: string;
      description: string | null;
      opens_at: Date;
      closes_at: Date;
      collection_event: string | null;
      status: string;
    }[]
  >`select * from drops where id = ${id}`;
  if (!drop) throw error(404, "not found");

  const products = await sql<
    {
      id: number;
      name: string;
      description: string | null;
      image_url: string | null;
    }[]
  >`select id, name, description, image_url from products where drop_id = ${id} order by id`;

  const productIds = products.map((p) => p.id);
  const variants = productIds.length
    ? await sql<
        {
          id: number;
          product_id: number;
          label: string;
          price_pence: number;
          stock_count: number | null;
        }[]
      >`
        select id, product_id, label, price_pence, stock_count
        from variants
        where product_id in ${sql(productIds)}
        order by id
      `
    : [];

  return { drop, products, variants };
};

export const actions: Actions = {
  update: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const name = String(data.get("name") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const opens_at = String(data.get("opens_at") ?? "").trim();
    const closes_at = String(data.get("closes_at") ?? "").trim();
    const collection_event = String(data.get("collection_event") ?? "").trim();
    const status = String(data.get("status") ?? "").trim();
    if (!name || !opens_at || !closes_at || !status) {
      return fail(400, { error: "missing fields" });
    }
    await sql`
      update drops set
        name = ${name},
        description = ${description || null},
        opens_at = ${opens_at},
        closes_at = ${closes_at},
        collection_event = ${collection_event || null},
        status = ${status}
      where id = ${id}
    `;
    return { ok: true };
  },
  destroy: async ({ params }) => {
    const id = Number(params.id);
    await sql`delete from drops where id = ${id}`;
    throw redirect(303, "/admin/drops");
  },
  addProduct: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const name = String(data.get("name") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    if (!name) return fail(400, { error: "product name required" });
    const file = data.get("image");
    let image_url: string | null = null;
    if (file instanceof File && file.size > 0) {
      try {
        image_url = await saveUpload(file);
      } catch (err) {
        return fail(400, { error: `image: ${(err as Error).message}` });
      }
    }
    await sql`
      insert into products (drop_id, type, name, description, image_url)
      values (${id}, 'drop', ${name}, ${description || null}, ${image_url})
    `;
    return { ok: true };
  },
  deleteProduct: async ({ request }) => {
    const data = await request.formData();
    const pid = Number(data.get("product_id"));
    if (!Number.isFinite(pid)) return fail(400, { error: "bad product id" });
    await sql`delete from products where id = ${pid}`;
    return { ok: true };
  },
  addVariant: async ({ request }) => {
    const data = await request.formData();
    const product_id = Number(data.get("product_id"));
    const label = String(data.get("label") ?? "").trim();
    const price_pence = Number(data.get("price_pence"));
    const stock_raw = String(data.get("stock_count") ?? "").trim();
    const stock_count = stock_raw === "" ? null : Number(stock_raw);
    if (
      !Number.isFinite(product_id) ||
      !label ||
      !Number.isFinite(price_pence) ||
      price_pence < 0
    ) {
      return fail(400, { error: "bad variant fields" });
    }
    await sql`
      insert into variants (product_id, label, price_pence, stock_count)
      values (${product_id}, ${label}, ${price_pence}, ${stock_count})
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
