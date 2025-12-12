import { error } from "@sveltejs/kit";
import { get_wiki_page } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const result = await get_wiki_page(params.path);

  if (!result) {
    throw error(404, "Wiki page not found");
  }

  const { document, html, sections } = result;

  return {
    title: document.metadata.title,
    description: document.metadata.description,
    html,
    sections,
    breadcrumbs: document.breadcrumbs,
    children: document.children.map((child) => ({
      slug: child.slug,
      title: child.metadata.title,
      description: child.metadata.description,
    })),
    prev: document.prev
      ? {
          slug: document.prev.slug,
          title: document.prev.title,
        }
      : null,
    next: document.next
      ? {
          slug: document.next.slug,
          title: document.next.title,
        }
      : null,
  };
};
