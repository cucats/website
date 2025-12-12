import { json } from "@sveltejs/kit";
import { all_documents } from "$lib/server/content";
import { slugify, clean, plaintext } from "$lib/server/markdown/utils";
import type { SearchBlock } from "$lib/server/content/types";

export const prerender = true;

export async function GET() {
  const blocks = await generateSearchBlocks();
  return json({ blocks });
}

function get_href(parts: string[]): string {
  return parts.length > 1 ? `/${parts[0]}#${parts.at(-1)}` : `/${parts[0]}`;
}

async function generateSearchBlocks(): Promise<SearchBlock[]> {
  const blocks: SearchBlock[] = [];

  for (const slug in all_documents) {
    const document = all_documents[slug];
    const { body, metadata } = document;
    const breadcrumbs = document.breadcrumbs.map((x) => x.title);

    // Determine rank based on content type
    let rank = 0;
    if (slug.startsWith("wiki/")) rank = 1;
    if (slug.startsWith("blog/")) rank = 2;

    // Split content by h2 sections
    const sections = body.trim().split(/^## /m);
    const intro = sections.shift()?.trim() ?? "";

    // Add intro block
    if (intro) {
      blocks.push({
        breadcrumbs: [...breadcrumbs, clean(metadata.title ?? "")],
        href: `/${slug}`,
        content: await plaintext(intro),
        rank,
      });
    }

    // Add section blocks
    for (const section of sections) {
      const lines = section.split("\n");
      const h2 = lines.shift();
      if (!h2) continue;

      const content = lines.join("\n");
      const subsections = content.trim().split(/^### /m);
      const sectionIntro = subsections.shift()?.trim();

      if (sectionIntro) {
        blocks.push({
          breadcrumbs: [...breadcrumbs, clean(metadata.title), clean(h2)],
          href: `/${slug}#${slugify(h2)}`,
          content: await plaintext(sectionIntro),
          rank,
        });
      }

      // Add subsection blocks (h3)
      for (const subsection of subsections) {
        const subLines = subsection.split("\n");
        const h3 = subLines.shift();
        if (!h3) continue;

        blocks.push({
          breadcrumbs: [
            ...breadcrumbs,
            clean(metadata.title),
            clean(h2),
            clean(h3),
          ],
          href: `/${slug}#${slugify(h2)}-${slugify(h3)}`,
          content: await plaintext(subLines.join("\n").trim()),
          rank,
        });
      }
    }
  }

  return blocks;
}
