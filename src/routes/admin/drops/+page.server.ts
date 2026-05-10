import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

export const load: PageServerLoad = async () => {
  const drops = await sql<
    {
      id: number;
      slug: string;
      name: string;
      opens_at: Date;
      closes_at: Date;
      status: string;
    }[]
  >`
    select id, slug, name, opens_at, closes_at, status
    from drops
    order by opens_at desc
  `;
  return { drops };
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
        insert into drops (slug, name, opens_at, closes_at, collection_event)
        values (${slug}, ${name}, ${opens_at}, ${closes_at}, ${collection_event || null})
        returning id
      `;
    } catch (err) {
      return fail(400, { error: (err as Error).message });
    }
    throw redirect(303, `/admin/drops/${row.id}`);
  },
};
