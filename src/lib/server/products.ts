import { sql } from "$lib/server/db";

export async function swapDisplayOrder(id: number, direction: "up" | "down") {
  await sql.begin(async (tx) => {
    const [current] = await tx<
      { display_order: number; type: string; drop_id: number | null }[]
    >`select display_order, type, drop_id from products where id = ${id}`;
    if (!current) return;

    const neighbour =
      direction === "up"
        ? await tx<{ id: number; display_order: number }[]>`
            select id, display_order from products
            where type = ${current.type}
              and drop_id is not distinct from ${current.drop_id}
              and (display_order, id) < (${current.display_order}, ${id})
            order by display_order desc, id desc
            limit 1
          `
        : await tx<{ id: number; display_order: number }[]>`
            select id, display_order from products
            where type = ${current.type}
              and drop_id is not distinct from ${current.drop_id}
              and (display_order, id) > (${current.display_order}, ${id})
            order by display_order asc, id asc
            limit 1
          `;
    if (neighbour.length === 0) return;
    const other = neighbour[0];
    await tx`update products set display_order = ${other.display_order} where id = ${id}`;
    await tx`update products set display_order = ${current.display_order} where id = ${other.id}`;
  });
}
