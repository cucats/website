import { blog_posts } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  return {
    posts: blog_posts.map((post) => ({
      slug: post.slug.replace("blog/", ""),
      title: post.metadata.title,
      description: post.metadata.description,
      date: post.date,
      date_formatted: post.date_formatted,
      authors: post.authors,
    })),
  };
};
