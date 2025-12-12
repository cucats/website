import {
  create_index,
  process_blog_posts,
  get_wiki_tree,
} from "./content/index";
import { render } from "./markdown/renderer";
import type { Document, BlogPost } from "./content/types";

// Glob import all markdown files from the content directory
const documents = import.meta.glob<string>("../../content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Build the content index
const index = await create_index(
  documents,
  "../../content",
  async (content: string) => content,
);

// Export processed content
export const blog_posts: BlogPost[] = process_blog_posts(index);
export const wiki = get_wiki_tree(index);
export const all_documents = index;

/**
 * Get a document by slug and render its content
 */
export async function get_document(slug: string): Promise<{
  document: Document;
  html: string;
  sections: Array<{ slug: string; title: string }>;
} | null> {
  const document = index[slug];
  if (!document) return null;

  const { html, sections } = await render(document.body);

  return {
    document,
    html,
    sections,
  };
}

/**
 * Get a blog post by slug
 */
export async function get_blog_post(slug: string): Promise<{
  post: BlogPost;
  html: string;
  sections: Array<{ slug: string; title: string }>;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
} | null> {
  const postIndex = blog_posts.findIndex((p) => p.slug === `blog/${slug}`);
  if (postIndex === -1) return null;

  const post = blog_posts[postIndex];
  const { html, sections } = await render(post.body);

  // Compute prev/next within blog posts only (sorted newest first)
  const prevPost = blog_posts[postIndex + 1]; // older post
  const nextPost = blog_posts[postIndex - 1]; // newer post

  return {
    post,
    html,
    sections,
    prev: prevPost
      ? {
          slug: prevPost.slug.replace("blog/", ""),
          title: prevPost.metadata.title,
        }
      : null,
    next: nextPost
      ? {
          slug: nextPost.slug.replace("blog/", ""),
          title: nextPost.metadata.title,
        }
      : null,
  };
}

/**
 * Get a wiki page by path
 */
export async function get_wiki_page(path: string): Promise<{
  document: Document;
  html: string;
  sections: Array<{ slug: string; title: string }>;
} | null> {
  const slug = path ? `wiki/${path}` : "wiki";
  return get_document(slug);
}

export type { Document, BlogPost };
