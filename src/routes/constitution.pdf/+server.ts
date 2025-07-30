import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  const url = "https://cucats.github.io/constitution/constitution.pdf";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }

  const pdfBuffer = await response.arrayBuffer();

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="constitution.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
};
