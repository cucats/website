import type { RequestHandler } from "./$types";

const EVENT_CALENDAR_URL =
  "https://calendar.google.com/calendar/ical/96418f67b81992db38a56559ea53110094bd3b2ca62c98ab9d4aac0a3b4b8bb1%40group.calendar.google.com/public/basic.ics";

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
