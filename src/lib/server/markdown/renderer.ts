import { Marked } from "marked";
import { createHighlighter, type Highlighter } from "shiki";
import katex from "katex";
import { slugify } from "./utils";

let highlighter: Highlighter | null = null;

// Regex to match math expressions
// Display: $$...$$ (multiline)
// Inline: $...$ (single line, not preceded/followed by $)
const DISPLAY_MATH_REGEX = /\$\$([\s\S]+?)\$\$/g;
const INLINE_MATH_REGEX = /(?<!\$)\$(?!\$)((?:[^$]|\\\$)+?)\$(?!\$)/g;

const SHIKI_LANGUAGE_MAP: Record<string, string> = {
  bash: "bash",
  sh: "bash",
  shell: "bash",
  html: "html",
  svelte: "svelte",
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
  css: "css",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  python: "python",
  py: "python",
  rust: "rust",
  go: "go",
  c: "c",
  cpp: "cpp",
  java: "java",
  sql: "sql",
  md: "markdown",
  markdown: "markdown",
  "": "text",
};

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [
        "javascript",
        "typescript",
        "html",
        "css",
        "svelte",
        "bash",
        "json",
        "yaml",
        "python",
        "rust",
        "go",
        "c",
        "cpp",
        "java",
        "sql",
        "markdown",
      ],
    });
  }
  return highlighter;
}

export interface Section {
  slug: string;
  title: string;
}

export interface RenderResult {
  html: string;
  sections: Section[];
}

/**
 * Render markdown to HTML with syntax highlighting
 */
export async function render(markdown: string): Promise<RenderResult> {
  const hl = await getHighlighter();
  const sections: Section[] = [];
  const headings: string[] = [];

  // Extract math expressions BEFORE markdown parsing to prevent marked from mangling them
  const mathPlaceholders: Map<string, string> = new Map();
  let placeholderIndex = 0;

  // Extract display math first ($$...$$)
  let processedMarkdown = markdown.replace(DISPLAY_MATH_REGEX, (_, math) => {
    const placeholder = `%%MATH_DISPLAY_${placeholderIndex++}%%`;
    try {
      mathPlaceholders.set(
        placeholder,
        katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
          strict: false,
        }),
      );
    } catch (e) {
      console.error("KaTeX error:", e);
      mathPlaceholders.set(
        placeholder,
        `<span class="math-error">Math error: ${escapeHtml(math)}</span>`,
      );
    }
    return placeholder;
  });

  // Extract inline math ($...$)
  processedMarkdown = processedMarkdown.replace(
    INLINE_MATH_REGEX,
    (_, math) => {
      const placeholder = `%%MATH_INLINE_${placeholderIndex++}%%`;
      try {
        mathPlaceholders.set(
          placeholder,
          katex.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: false,
            strict: false,
          }),
        );
      } catch (e) {
        console.error("KaTeX error:", e);
        mathPlaceholders.set(
          placeholder,
          `<span class="math-error">Math error: ${escapeHtml(math)}</span>`,
        );
      }
      return placeholder;
    },
  );

  const marked = new Marked({
    async: true,
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser!.parseInline(tokens);
        const plainText = text.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags

        headings[depth - 1] = slugify(plainText);
        headings.length = depth;
        const slug = headings.filter(Boolean).join("-");

        if (depth === 2) {
          sections.push({ slug, title: plainText });
        }

        return `<h${depth} id="${slug}"><a href="#${slug}" class="anchor">${text}</a></h${depth}>`;
      },

      code({ text, lang }) {
        const language = SHIKI_LANGUAGE_MAP[lang ?? ""] ?? "text";

        try {
          const html = hl.codeToHtml(text, {
            lang: language,
            themes: {
              light: "github-light",
              dark: "github-dark",
            },
          });
          return `<div class="code-block" data-language="${lang ?? ""}">${html}</div>`;
        } catch {
          // Fallback if language not supported
          return `<div class="code-block" data-language="${lang ?? ""}"><pre><code>${escapeHtml(text)}</code></pre></div>`;
        }
      },

      codespan({ text }) {
        return `<code>${escapeHtml(text)}</code>`;
      },

      link({ href, title, tokens }) {
        const text = this.parser!.parseInline(tokens);
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
        const isExternal = href?.startsWith("http");
        const externalAttrs = isExternal
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";
        return `<a href="${href}"${titleAttr}${externalAttrs}>${text}</a>`;
      },

      image({ href, title, text }) {
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
        const altAttr = text ? ` alt="${escapeHtml(text)}"` : "";
        return `<img src="${href}"${altAttr}${titleAttr} loading="lazy">`;
      },

      blockquote({ tokens }) {
        const content = this.parser!.parse(tokens);

        // Support for note/warning callouts
        if (content.includes("[!NOTE]")) {
          return `<blockquote class="callout note">${content.replace("[!NOTE]", "")}</blockquote>`;
        }
        if (content.includes("[!WARNING]")) {
          return `<blockquote class="callout warning">${content.replace("[!WARNING]", "")}</blockquote>`;
        }
        if (content.includes("[!TIP]")) {
          return `<blockquote class="callout tip">${content.replace("[!TIP]", "")}</blockquote>`;
        }

        return `<blockquote>${content}</blockquote>`;
      },

      table({ header, rows }) {
        const headerHtml = header
          .map((cell) => `<th>${this.parser!.parseInline(cell.tokens)}</th>`)
          .join("");
        const bodyHtml = rows
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${this.parser!.parseInline(cell.tokens)}</td>`).join("")}</tr>`,
          )
          .join("");

        return `<div class="table-wrapper"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
      },
    },
  });

  let html = (await marked.parse(processedMarkdown)) ?? "";

  // Restore math expressions from placeholders
  for (const [placeholder, rendered] of mathPlaceholders) {
    html = html.replace(placeholder, rendered);
  }

  return { html, sections };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
