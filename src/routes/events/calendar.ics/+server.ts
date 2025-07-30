import type { RequestHandler } from "./$types";

const EVENT_CALENDAR_URL =
  "https://calendar.google.com/calendar/ical/7f9535ddcb624febf772aa3b5b5dd4da7d4dc929c311fea3f26b1d896ad4d3e0%40group.calendar.google.com/public/basic.ics";

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
