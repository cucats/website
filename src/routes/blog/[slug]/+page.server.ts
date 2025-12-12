import { error } from "@sveltejs/kit";
import { get_blog_post } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const result = await get_blog_post(params.slug);

  if (!result) {
    throw error(404, "Blog post not found");
  }

  const { post, html, sections } = result;

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    date: post.date,
    date_formatted: post.date_formatted,
    authors: post.authors,
    html,
    sections,
    prev: post.prev,
    next: post.next,
  };
};
