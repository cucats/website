import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";
import { saveUpload } from "$lib/server/uploads";

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
      axis_name: string | null;
    }[]
  >`select id, name, description, image_url, price, axis_name from products where id = ${id}`;
  if (!product) throw error(404, "not found");

  const variants = await sql<
    {
      id: number;
      options: Record<string, string>;
    }[]
  >`
    select id, options
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

async function variantValueFor(productId: number, axisName: string, value: string) {
  await sql`
    insert into variants (product_id, options, display_order)
    values (
      ${productId},
      ${sql.json({ [axisName]: value })},
      coalesce((select max(display_order) + 1 from variants where product_id = ${productId}), 0)
    )
  `;
}

export const actions: Actions = {
  update: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const name = String(data.get("title") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const axisName = String(data.get("axis_name") ?? "").trim() || null;
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

    const [old] = await sql<{ axis_name: string | null }[]>`
      select axis_name from products where id = ${id}
    `;

    if (newImage !== undefined) {
      await sql`
        update products set
          name = ${name},
          description = ${description || null},
          price = ${price},
          axis_name = ${axisName},
          image_url = ${newImage}
        where id = ${id}
      `;
    } else {
      await sql`
        update products set
          name = ${name},
          description = ${description || null},
          price = ${price},
          axis_name = ${axisName}
        where id = ${id}
      `;
    }

    // Rename the option key on existing variants if the axis name changed.
    if (old?.axis_name && axisName && old.axis_name !== axisName) {
      await sql`
        update variants set options =
          jsonb_build_object(${axisName}::text, options->>${old.axis_name})
        where product_id = ${id}
          and options ? ${old.axis_name}
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
    const value = String(data.get("value") ?? "").trim();
    if (!value) return fail(400, { error: "Value required" });
    const [p] = await sql<{ axis_name: string | null }[]>`
      select axis_name from products where id = ${id}
    `;
    if (!p?.axis_name) {
      return fail(400, { error: "Set an axis name (e.g. size) on the product first" });
    }
    await variantValueFor(id, p.axis_name, value);
    return { ok: true };
  },
  addVariantRun: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const valuesRaw = String(data.get("values") ?? "").trim();
    if (!valuesRaw) return fail(400, { error: "values required" });
    const [p] = await sql<{ axis_name: string | null }[]>`
      select axis_name from products where id = ${id}
    `;
    if (!p?.axis_name) {
      return fail(400, { error: "Set an axis name first" });
    }
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
      for (const v of values) {
        await tx`
          insert into variants (product_id, options, display_order)
          values (${id}, ${sql.json({ [p.axis_name!]: v })}, ${next})
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
