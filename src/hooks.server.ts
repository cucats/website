import {
    COOKIE_NAME,
    deleteSessionTokenCookie,
    setSessionTokenCookie,
    validateSessionToken,
} from "$lib/server/session";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get(COOKIE_NAME) ?? null;
    if (token) {
        const { session, user } = await validateSessionToken(token);

        if (session) {
            setSessionTokenCookie(event, token, session.expires);
        } else {
            deleteSessionTokenCookie(event);
        }

        event.locals.session = session;
        event.locals.user = user;
    } else {
        event.locals.session = null;
        event.locals.user = null;
    }

    return resolve(event);
};
