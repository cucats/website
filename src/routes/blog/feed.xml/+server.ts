import { blog_posts } from "$lib/server/content";

export const prerender = true;

export async function GET() {
  const posts = blog_posts.slice(0, 20); // Latest 20 posts
  const updated = posts[0]?.date
    ? `${posts[0].date}T00:00:00Z`
    : new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>CUCaTS Blog</title>
  <subtitle>News, tutorials, and updates from the Cambridge University Computing and Technology Society</subtitle>
  <link href="https://cucats.org/blog"/>
  <link href="https://cucats.org/blog/feed.xml" rel="self" type="application/atom+xml"/>
  <updated>${updated}</updated>
  <id>https://cucats.org/blog</id>
  <icon>https://cucats.org/favicon.png</icon>
${posts
  .map(
    (post) => `  <entry>
    <title>${escapeXml(post.metadata.title)}</title>
    <link href="https://cucats.org/blog/${post.slug.replace("blog/", "")}"/>
    <id>https://cucats.org/blog/${post.slug.replace("blog/", "")}</id>
    <updated>${post.date}T00:00:00Z</updated>
    <published>${post.date}T00:00:00Z</published>${
      post.metadata.description
        ? `
    <summary>${escapeXml(post.metadata.description)}</summary>`
        : ""
    }
    <author>
      <name>${post.authors.length > 0 ? post.authors.map((a) => a.name).join(", ") : "CUCaTS"}</name>
    </author>
  </entry>`,
  )
  .join("\n")}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "max-age=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, (c) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[c] ?? c;
  });
}
