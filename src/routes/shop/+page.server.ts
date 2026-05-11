import type { PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

type ShowcaseSummary = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  kind: "drop" | "always_on";
  opens_at: Date | null;
  closes_at: Date | null;
  status: string;
};

export const load: PageServerLoad = async () => {
  const now = new Date();

  const openShowcases = await sql<ShowcaseSummary[]>`
    select id, slug, name, description, kind, opens_at, closes_at, status
    from showcases
    where status = 'open'
      and (opens_at is null or opens_at <= ${now})
      and (closes_at is null or closes_at > ${now})
    order by
      case kind when 'drop' then 0 else 1 end,
      closes_at asc nulls last,
      display_order, id
  `;

  const pastDrops = await sql<ShowcaseSummary[]>`
    select id, slug, name, description, kind, opens_at, closes_at, status
    from showcases
    where kind = 'drop' and status in ('closed','fulfilled')
    order by closes_at desc nulls last
    limit 6
  `;

  return { openShowcases, pastDrops };
};
