import type { PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

type DropSummary = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  opens_at: Date;
  closes_at: Date;
  collection_event: string | null;
  status: string;
};

type ProductSummary = {
  id: number;
  drop_id: number | null;
  name: string;
  description: string | null;
  image_url: string | null;
  min_price: number | null;
  max_price: number | null;
};

export const load: PageServerLoad = async () => {
  const now = new Date();

  const [openDrop] = await sql<DropSummary[]>`
    select id, slug, name, description, opens_at, closes_at, collection_event, status
    from drops
    where status = 'open' and opens_at <= ${now} and closes_at > ${now}
    order by closes_at asc
    limit 1
  `;

  const pastDrops = await sql<DropSummary[]>`
    select id, slug, name, description, opens_at, closes_at, collection_event, status
    from drops
    where status in ('closed','fulfilled')
    order by closes_at desc
    limit 6
  `;

  const podProducts = await sql<ProductSummary[]>`
    select p.id, p.drop_id, p.name, p.description, p.image_url,
           min(v.price) as min_price,
           max(v.price) as max_price
    from products p
    left join variants v on v.product_id = p.id
    where p.type = 'pod'
    group by p.id
    order by p.id desc
  `;

  return { openDrop, pastDrops, podProducts };
};
