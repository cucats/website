import { EVENT_CALENDAR_URL } from "$env/static/private";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  try {
    const response = await fetch(EVENT_CALENDAR_URL);
    const ics = await response.text();

    return new Response(ics, {
      headers: {
        "Content-Type": "text/calendar",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to fetch calendar:", error);
    return new Response("Failed to fetch calendar", { status: 500 });
  }
};
