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
    }[]
  >`select id, name, description, image_url, price from products where id = ${id}`;
  if (!product) throw error(404, "not found");

  const axes = await sql<
    {
      id: number;
      name: string;
      values: string[];
      display_order: number;
    }[]
  >`
    select id, name, values, display_order
    from product_axes
    where product_id = ${id}
    order by display_order, id
  `;

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

  return { product, axes, variants, showcases, availableShowcases };
};

function cartesian(axes: { name: string; values: string[] }[]): Record<string, string>[] {
  if (axes.length === 0) return [];
  let combos: Record<string, string>[] = [{}];
  for (const axis of axes) {
    if (axis.values.length === 0) return [];
    const next: Record<string, string>[] = [];
    for (const combo of combos) {
      for (const v of axis.values) {
        next.push({ ...combo, [axis.name]: v });
      }
    }
    combos = next;
  }
  return combos;
}

function optionsEqual(a: Record<string, string>, b: Record<string, string>): boolean {
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (a[k] !== b[k]) return false;
  return true;
}

export const actions: Actions = {
  update: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const name = String(data.get("title") ?? "").trim();
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
        update products set name = ${name},
          description = ${description || null},
          price = ${price},
          image_url = ${newImage}
        where id = ${id}
      `;
    } else {
      await sql`
        update products set name = ${name},
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

  addAxis: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const name = String(data.get("name") ?? "").trim();
    if (!name) return fail(400, { error: "axis name required" });
    try {
      await sql`
        insert into product_axes (product_id, name, display_order)
        values (
          ${id}, ${name},
          coalesce((select max(display_order) + 1 from product_axes where product_id = ${id}), 0)
        )
      `;
    } catch (err) {
      return fail(400, { error: `axis "${name}" already exists on this product` });
    }
    return { ok: true };
  },
  renameAxis: async ({ request }) => {
    const data = await request.formData();
    const axisId = Number(data.get("axis_id"));
    const name = String(data.get("name") ?? "").trim();
    if (!Number.isFinite(axisId) || !name) return fail(400, { error: "bad input" });
    const [axis] = await sql<{ name: string; product_id: number }[]>`
      select name, product_id from product_axes where id = ${axisId}
    `;
    if (!axis) return fail(404, { error: "axis not found" });
    if (axis.name === name) return { ok: true };
    await sql.begin(async (tx) => {
      await tx`update product_axes set name = ${name} where id = ${axisId}`;
      // Rename the key inside every variant of this product so existing
      // variants still match the axis after rename.
      await tx`
        update variants set options =
          (options - ${axis.name}) ||
          jsonb_build_object(${name}::text, options->>${axis.name})
        where product_id = ${axis.product_id}
          and options ? ${axis.name}
      `;
    });
    return { ok: true };
  },
  removeAxis: async ({ request }) => {
    const data = await request.formData();
    const axisId = Number(data.get("axis_id"));
    if (!Number.isFinite(axisId)) return fail(400, { error: "bad axis id" });
    await sql`delete from product_axes where id = ${axisId}`;
    return { ok: true };
  },
  setAxisValues: async ({ request }) => {
    const data = await request.formData();
    const axisId = Number(data.get("axis_id"));
    const raw = String(data.get("values") ?? "");
    if (!Number.isFinite(axisId)) return fail(400, { error: "bad axis id" });
    const values = raw
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    await sql`
      update product_axes set values = ${values}::text[]
      where id = ${axisId}
    `;
    return { ok: true };
  },
  reorderAxes: async ({ request, params }) => {
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
          update product_axes set display_order = ${i}
          where id = ${ids[i]} and product_id = ${id}
        `;
      }
    });
    return { ok: true };
  },

  generateVariants: async ({ params }) => {
    const id = Number(params.id);
    const axes = await sql<{ name: string; values: string[] }[]>`
      select name, values from product_axes
      where product_id = ${id}
      order by display_order, id
    `;
    if (axes.length === 0) {
      return fail(400, { error: "Add at least one axis first" });
    }
    const empty = axes.find((a) => a.values.length === 0);
    if (empty) {
      return fail(400, { error: `Axis "${empty.name}" has no values` });
    }
    const combos = cartesian(axes);
    const existing = await sql<{ id: number; options: Record<string, string> }[]>`
      select id, options from variants where product_id = ${id}
    `;
    await sql.begin(async (tx) => {
      const [m] = await tx<{ next: number }[]>`
        select coalesce(max(display_order) + 1, 0) as next
        from variants where product_id = ${id}
      `;
      let next = m.next;
      for (const combo of combos) {
        const match = existing.find((e) => optionsEqual(e.options, combo));
        if (match) continue;
        await tx`
          insert into variants (product_id, options, display_order)
          values (${id}, ${sql.json(combo)}, ${next})
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
