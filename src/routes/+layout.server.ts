import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => ({
  pathname: url.pathname,
  session: await locals.auth(),
});
