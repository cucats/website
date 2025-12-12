import {
  extract_frontmatter,
  slugify,
  is_in_code_block,
} from "../markdown/utils";
import type { Document, BlogPost } from "./types";

/**
 * Create an index of all content documents
 */
export async function create_index(
  documents: Record<string, string>,
  base: string,
  readFile: (path: string) => Promise<string>,
): Promise<Record<string, Document>> {
  const content: Record<string, Document> = {};
  const roots: Document[] = [];

  for (const key in documents) {
    const file = key.slice(base.length + 1);
    // Remove numeric prefixes and .md extension to create slug
    const slug = file
      .replace(/(^|\/)[\d-]+-/g, "$1")
      .replace(/(\/index)?\.md$/, "");

    const text = await readFile(documents[key]);
    const { metadata, body } = extract_frontmatter(text);

    if (!metadata.title) {
      console.warn(`Missing title in ${file} frontmatter, using filename`);
      metadata.title = slug.split("/").pop() ?? "Untitled";
    }

    // Extract h2 sections for navigation
    const sections = Array.from(body.matchAll(/^##\s+(.*)$/gm)).reduce(
      (arr, match) => {
        if (is_in_code_block(body, match.index ?? 0)) return arr;
        const title = match[1].replace(/`(.+?)`/g, (_, contents) =>
          contents.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
        );
        const sectionSlug = slugify(title);
        arr.push({ slug: sectionSlug, title });
        return arr;
      },
      [] as Array<{ slug: string; title: string }>,
    );

    content[slug] = {
      slug,
      file,
      metadata: metadata as Document["metadata"],
      breadcrumbs: [],
      body,
      sections,
      children: [],
      prev: null,
      next: null,
    };
  }

  // Build document tree and breadcrumbs
  for (const slug in content) {
    const parts = slug.split("/");
    parts.pop();

    const document = content[slug];

    if (parts.length === 0) {
      roots.push(document);
    } else {
      const parent = content[parts.join("/")];

      if (parent) {
        parent.children.push(document);

        // Build breadcrumbs
        let breadcrumbParts = [...parts];
        while (breadcrumbParts.length) {
          const parentSlug = breadcrumbParts.join("/");
          const parentDoc = content[parentSlug];
          if (parentDoc) {
            document.breadcrumbs.unshift({
              slug: parentSlug,
              title: parentDoc.metadata.title,
            });
          }
          breadcrumbParts.pop();
        }
      } else {
        roots.push(document);
      }
    }
  }

  // Create prev/next links
  let prev: Document | null = null;
  for (const document of roots) {
    prev = create_links(document, prev);
  }

  return content;
}

function create_links(
  document: Document,
  prev: Document | null,
): Document | null {
  if (document.body) {
    if (prev) {
      prev.next = { slug: document.slug, title: document.metadata.title };
      document.prev = { slug: prev.slug, title: prev.metadata.title };
    }
    prev = document;
  }

  for (const child of document.children) {
    prev = create_links(child, prev);
  }

  return prev;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function format_date(date: string): string {
  const [y, m, d] = date.split("-");
  const month = months[+m - 1];
  return `${+d} ${month} ${y}`;
}

/**
 * Process blog posts with additional metadata
 */
export function process_blog_posts(
  documents: Record<string, Document>,
): BlogPost[] {
  return Object.values(documents)
    .filter(
      (doc) => doc.file.startsWith("blog/") && !doc.file.endsWith("index.md"),
    )
    .map((post) => {
      // Extract date from filename (YYYY-MM-DD-title.md)
      const dateMatch = post.file.match(/(\d{4}-\d{2}-\d{2})/);
      const date = post.metadata.date ?? dateMatch?.[1] ?? "";

      // Parse authors
      const authors: Array<{ name: string; url?: string }> = [];
      if (post.metadata.author) {
        const names = post.metadata.author.split(/, ?/);
        const urls = post.metadata.authorURL?.split(/, ?/) ?? [];
        authors.push(...names.map((name, i) => ({ name, url: urls[i] })));
      }

      return {
        ...post,
        date,
        date_formatted: date ? format_date(date) : "",
        authors,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Get wiki documents organized by category
 */
export function get_wiki_tree(
  documents: Record<string, Document>,
): Document | null {
  return documents["wiki"] ?? null;
}
