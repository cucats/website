import { get_wiki_page } from "$lib/server/content";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const result = await get_wiki_page("");

  if (!result) {
    throw error(404, "Wiki not found");
  }

  const { document, html, sections } = result;

  return {
    title: document.metadata.title,
    description: document.metadata.description,
    html,
    sections,
    children: document.children.map((child) => ({
      slug: child.slug,
      title: child.metadata.title,
      description: child.metadata.description,
    })),
  };
};
