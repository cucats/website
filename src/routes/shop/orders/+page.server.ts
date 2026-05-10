import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { sql } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  if (!session?.user) throw redirect(303, "/shop");

  const orders = await sql<
    {
      id: number;
      reference: string;
      type: string;
      status: string;
      total: number;
      created_at: Date;
    }[]
  >`
    select id, reference, type, status, total, created_at
    from orders
    where user_id = ${session.user.id}
    order by created_at desc
  `;
  return { orders };
};
