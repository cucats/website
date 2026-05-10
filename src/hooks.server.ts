import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { authHandle } from "$lib/server/auth";

const adminGate: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith("/admin")) {
    const session = await event.locals.auth();
    if (!session?.user) throw redirect(303, "/signin");
    if (!session.user.isAdmin) throw redirect(303, "/");
  }
  return resolve(event);
};

export const handle = sequence(authHandle, adminGate);
