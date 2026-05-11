import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) throw error(404, "not found");

  const [showcase] = await sql<
    {
      id: number;
      slug: string;
      name: string;
      description: string | null;
      kind: string;
      opens_at: Date | null;
      closes_at: Date | null;
      collection_event: string | null;
      status: string;
    }[]
  >`select * from showcases where id = ${id}`;
  if (!showcase) throw error(404, "not found");

  const products = await sql<
    {
      id: number;
      name: string;
      image_url: string | null;
      price: number;
      display_order: number;
    }[]
  >`
    select p.id, p.name, p.image_url, p.price, sp.display_order
    from products p
    join showcase_products sp on sp.product_id = p.id
    where sp.showcase_id = ${id}
    order by sp.display_order, p.id
  `;

  const available = await sql<
    { id: number; name: string; image_url: string | null; price: number }[]
  >`
    select p.id, p.name, p.image_url, p.price from products p
    where p.id not in (
      select product_id from showcase_products where showcase_id = ${id}
    )
    order by p.display_order, p.id
  `;

  return { showcase, products, available };
};

export const actions: Actions = {
  update: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const name = String(data.get("name") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const status = String(data.get("status") ?? "").trim();
    if (!name || !status) return fail(400, { error: "missing fields" });

    const [current] = await sql<{ kind: string }[]>`
      select kind from showcases where id = ${id}
    `;
    if (!current) throw error(404, "not found");

    if (current.kind === "drop") {
      const opens_at = String(data.get("opens_at") ?? "").trim();
      const closes_at = String(data.get("closes_at") ?? "").trim();
      const collection_event = String(data.get("collection_event") ?? "").trim();
      if (!opens_at || !closes_at) {
        return fail(400, { error: "opens_at and closes_at required for drops" });
      }
      await sql`
        update showcases set
          name = ${name},
          description = ${description || null},
          opens_at = ${opens_at},
          closes_at = ${closes_at},
          collection_event = ${collection_event || null},
          status = ${status}
        where id = ${id}
      `;
    } else {
      await sql`
        update showcases set
          name = ${name},
          description = ${description || null},
          status = ${status}
        where id = ${id}
      `;
    }
    return { ok: true };
  },
  destroy: async ({ params }) => {
    const id = Number(params.id);
    const [s] = await sql<{ kind: string }[]>`
      select kind from showcases where id = ${id}
    `;
    if (s?.kind === "always_on") {
      return fail(400, { error: "cannot delete the always-on showcase" });
    }
    await sql`delete from showcases where id = ${id}`;
    throw redirect(303, "/admin/showcases");
  },
  addProduct: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const product_id = Number(data.get("product_id"));
    if (!Number.isFinite(product_id)) return fail(400, { error: "bad product id" });
    await sql`
      insert into showcase_products (showcase_id, product_id, display_order)
      values (
        ${id}, ${product_id},
        coalesce((select max(display_order) + 1 from showcase_products where showcase_id = ${id}), 0)
      )
      on conflict do nothing
    `;
    return { ok: true };
  },
  removeProduct: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const product_id = Number(data.get("product_id"));
    if (!Number.isFinite(product_id)) return fail(400, { error: "bad product id" });
    await sql`
      delete from showcase_products
      where showcase_id = ${id} and product_id = ${product_id}
    `;
    return { ok: true };
  },
  reorderProducts: async ({ request, params }) => {
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
          update showcase_products set display_order = ${i}
          where showcase_id = ${id} and product_id = ${ids[i]}
        `;
      }
    });
    return { ok: true };
  },
};
