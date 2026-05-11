import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { saveUpload } from "$lib/server/uploads";
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
      price: number;
    }[]
  >`select id, name, description, image_url, price from products where id = ${id}`;
  if (!product) throw error(404, "not found");

  const variants = await sql<
    {
      id: number;
      options: Record<string, string>;
      enabled: boolean;
    }[]
  >`
    select id, options, enabled
    from variants
    where product_id = ${id}
    order by display_order, id
  `;

  const showcases = await sql<
    { id: number; slug: string; name: string; kind: string }[]
  >`
    select s.id, s.slug, s.name, s.kind
    from showcases s
    join showcase_products sp on sp.showcase_id = s.id
    where sp.product_id = ${id}
    order by s.display_order, s.id
  `;

  const availableShowcases = await sql<
    { id: number; name: string; kind: string }[]
  >`
    select id, name, kind from showcases
    where id not in (
      select showcase_id from showcase_products where product_id = ${id}
    )
    order by case kind when 'always_on' then 0 else 1 end, name
  `;

  return { product, variants, showcases, availableShowcases };
};

export const actions: Actions = {
  update: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const name = String(data.get("title") ?? data.get("name") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const priceRaw = data.get("price");
    const price = priceRaw === null ? null : Number(priceRaw);
    if (!name) return fail(400, { error: "title required" });
    if (price === null || !Number.isFinite(price) || price < 0) {
      return fail(400, { error: "price must be a non-negative number" });
    }
    const file = data.get("image");
    let newImage: string | null | undefined = undefined;
    if (file instanceof File && file.size > 0) {
      try {
        newImage = await saveUpload(file);
      } catch (err) {
        return fail(400, { error: `image: ${(err as Error).message}` });
      }
    }
    if (newImage !== undefined) {
      await sql`
        update products set
          name = ${name},
          description = ${description || null},
          price = ${price},
          image_url = ${newImage}
        where id = ${id}
      `;
    } else {
      await sql`
        update products set
          name = ${name},
          description = ${description || null},
          price = ${price}
        where id = ${id}
      `;
    }
    return { ok: true };
  },
  destroy: async ({ params }) => {
    const id = Number(params.id);
    await sql`delete from products where id = ${id}`;
    throw redirect(303, "/admin/products");
  },
  addVariant: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const optionsStr = String(data.get("options") ?? "").trim();
    const options = parseOptions(optionsStr);
    await sql`
      insert into variants (product_id, options, display_order)
      values (
        ${id}, ${JSON.stringify(options)}::jsonb,
        coalesce((select max(display_order) + 1 from variants where product_id = ${id}), 0)
      )
    `;
    return { ok: true };
  },
  addVariantRun: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const key = String(data.get("option_key") ?? "").trim();
    const valuesRaw = String(data.get("values") ?? "").trim();
    if (!key || !valuesRaw) return fail(400, { error: "bad bulk-variant fields" });
    const values = valuesRaw
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    if (values.length === 0) return fail(400, { error: "no values" });
    await sql.begin(async (tx) => {
      const [m] = await tx<{ next: number }[]>`
        select coalesce(max(display_order) + 1, 0) as next
        from variants where product_id = ${id}
      `;
      let next = m.next;
      for (const value of values) {
        const opts = { [key]: value };
        await tx`
          insert into variants (product_id, options, display_order)
          values (${id}, ${JSON.stringify(opts)}::jsonb, ${next})
        `;
        next++;
      }
    });
    return { ok: true };
  },
  reorderVariants: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const idsRaw = String(data.get("ids") ?? "");
    const ids = idsRaw
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));
    if (ids.length === 0) return fail(400, { error: "no ids" });
    await sql.begin(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
        await tx`
          update variants set display_order = ${i}
          where id = ${ids[i]} and product_id = ${id}
        `;
      }
    });
    return { ok: true };
  },
  toggleVariantEnabled: async ({ request }) => {
    const data = await request.formData();
    const vid = Number(data.get("variant_id"));
    if (!Number.isFinite(vid)) return fail(400, { error: "bad variant id" });
    await sql`update variants set enabled = not enabled where id = ${vid}`;
    return { ok: true };
  },
  deleteVariant: async ({ request }) => {
    const data = await request.formData();
    const vid = Number(data.get("variant_id"));
    if (!Number.isFinite(vid)) return fail(400, { error: "bad variant id" });
    await sql`delete from variants where id = ${vid}`;
    return { ok: true };
  },
  addToShowcase: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const sid = Number(data.get("showcase_id"));
    if (!Number.isFinite(sid)) return fail(400, { error: "bad showcase id" });
    await sql`
      insert into showcase_products (showcase_id, product_id, display_order)
      values (
        ${sid}, ${id},
        coalesce((select max(display_order) + 1 from showcase_products where showcase_id = ${sid}), 0)
      )
      on conflict do nothing
    `;
    return { ok: true };
  },
  removeFromShowcase: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const sid = Number(data.get("showcase_id"));
    if (!Number.isFinite(sid)) return fail(400, { error: "bad showcase id" });
    await sql`
      delete from showcase_products
      where showcase_id = ${sid} and product_id = ${id}
    `;
    return { ok: true };
  },
};
