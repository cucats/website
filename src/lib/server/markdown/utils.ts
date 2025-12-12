import { Marked, type Renderer, type MarkedExtension } from "marked";

/**
 * Extract YAML frontmatter from markdown content
 */
export function extract_frontmatter(markdown: string): {
  metadata: Record<string, string>;
  body: string;
} {
  const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
  if (!match) return { metadata: {}, body: markdown };

  const frontmatter = match[1];
  const body = markdown.slice(match[0].length).trim();

  const metadata: Record<string, string> = {};

  let key = "";
  let value = "";

  for (const line of frontmatter.split("\n")) {
    const lineMatch = /^(\w+):\s*(.*)$/.exec(line);
    if (lineMatch) {
      if (key) metadata[key] = value.trim();
      key = lineMatch[1];
      value = lineMatch[2];
    } else {
      value += "\n" + line;
    }
  }

  if (key) metadata[key] = value.trim();

  return { metadata, body };
}

/**
 * Generate a URL-safe slug from a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[`*_{}[\]()#+\-.!]/g, "") // Remove markdown characters
    .replace(/&.+?;/g, "") // Remove HTML entities
    .replace(/<\/?.+?>/g, "") // Remove HTML tags
    .replace(/[^a-z0-9-]/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/-{2,}/g, "-") // Collapse multiple hyphens
    .replace(/^-/, "") // Remove leading hyphen
    .replace(/-$/, ""); // Remove trailing hyphen
}

/**
 * Strip markdown formatting to get plain text (for search indexing)
 */
export function clean(markdown: string): string {
  return markdown
    .replace(/\*\*(.+?)\*\*/g, "$1") // Bold
    .replace(/_(.+?)_/g, "$1") // Italics
    .replace(/\*(.+?)\*/g, "$1") // Italics
    .replace(/`(.+?)`/g, "$1") // Inline code
    .replace(/~~(.+?)~~/g, "$1") // Strikethrough
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Links
    .replace(/\n/g, " ") // Newlines
    .replace(/ {2,}/g, " ") // Multiple spaces
    .trim();
}

/**
 * Check if an index is within a code block
 */
export function is_in_code_block(body: string, index: number): boolean {
  const code_blocks = [...body.matchAll(/(`{3,}).*\n(.|\n)+?\1/gm)].map(
    (match) => {
      return [match.index ?? 0, match[0].length + (match.index ?? 0)] as const;
    },
  );

  return code_blocks.some(([start, end]) => index >= start && index <= end);
}

/**
 * Transform markdown using marked with custom renderer options
 */
export async function transform(
  markdown: string,
  {
    walkTokens,
    ...renderer
  }: Partial<Renderer> & { walkTokens?: MarkedExtension["walkTokens"] } = {},
): Promise<string> {
  const marked = new Marked({
    async: true,
    renderer,
    walkTokens,
  });

  return (await marked.parse(markdown)) ?? "";
}

/**
 * Convert markdown to plaintext for search indexing
 */
export async function plaintext(markdown: string): Promise<string> {
  const result = await transform(markdown, {
    code: ({ text }) => {
      // Clean up code blocks for search
      return text
        .replace(/^\/\/ @noErrors.*$/gm, " ")
        .replace(/^\/\/ @errors.+$/gm, " ")
        .replace(/^\/\/\/ file:.+$/gm, " ");
    },
    blockquote: ({ text }) => text ?? "",
    html: () => "\n",
    heading: ({ text }) => `${text}\n`,
    hr: () => "",
    list({ items }) {
      return items.map((item) => item.text).join("\n");
    },
    listitem: ({ text }) => text ?? "",
    checkbox: () => "",
    paragraph({ tokens }) {
      return this.parser!.parseInline(tokens);
    },
    table({ header, rows }) {
      const headerText = header.map((cell) => cell.text).join(" ");
      const rowsText = rows
        .map((row) => row.map((cell) => cell.text).join(" "))
        .join("\n");
      return `${headerText}\n${rowsText}`;
    },
    tablerow: ({ text }) => text ?? "",
    tablecell: ({ text }) => text + " ",
    strong: ({ text }) => text,
    em: ({ text }) => text,
    codespan: ({ text }) => text,
    br: () => "",
    del: ({ text }) => text,
    link: ({ text }) => text,
    image: ({ text }) => text ?? "",
    text: ({ text }) => text,
  });

  return result
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code))
    .trim();
}
