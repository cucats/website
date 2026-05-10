import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

export const load: PageServerLoad = async () => {
  const showcases = await sql<
    {
      id: number;
      slug: string;
      name: string;
      kind: string;
      opens_at: Date | null;
      closes_at: Date | null;
      status: string;
      product_count: number;
    }[]
  >`
    select s.id, s.slug, s.name, s.kind, s.opens_at, s.closes_at, s.status,
           (select count(*)::int from showcase_products sp where sp.showcase_id = s.id) as product_count
    from showcases s
    order by
      case s.kind when 'always_on' then 0 else 1 end,
      s.opens_at desc nulls last,
      s.id desc
  `;
  return { showcases };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const slug = String(data.get("slug") ?? "").trim();
    const name = String(data.get("name") ?? "").trim();
    const opens_at = String(data.get("opens_at") ?? "").trim();
    const closes_at = String(data.get("closes_at") ?? "").trim();
    const collection_event = String(data.get("collection_event") ?? "").trim();
    if (!slug || !name || !opens_at || !closes_at) {
      return fail(400, { error: "slug, name, opens_at, closes_at are required" });
    }
    let row;
    try {
      [row] = await sql<{ id: number }[]>`
        insert into showcases (slug, name, kind, opens_at, closes_at, collection_event)
        values (${slug}, ${name}, 'drop', ${opens_at}, ${closes_at}, ${collection_event || null})
        returning id
      `;
    } catch (err) {
      return fail(400, { error: (err as Error).message });
    }
    throw redirect(303, `/admin/showcases/${row.id}`);
  },
};
