export interface Document {
  /** URL slug for the document */
  slug: string;
  /** Original file path */
  file: string;
  /** Frontmatter metadata */
  metadata: {
    title: string;
    description?: string;
    author?: string;
    date?: string;
    [key: string]: string | undefined;
  };
  /** Breadcrumb trail */
  breadcrumbs: Array<{ slug: string; title: string }>;
  /** Raw markdown body */
  body: string;
  /** Section headings (h2) */
  sections: Array<{ slug: string; title: string }>;
  /** Child documents */
  children: Document[];
  /** Previous document link */
  prev: { slug: string; title: string } | null;
  /** Next document link */
  next: { slug: string; title: string } | null;
}

export interface BlogPost extends Document {
  /** Post date (YYYY-MM-DD) */
  date: string;
  /** Formatted date string */
  date_formatted: string;
  /** Author information */
  authors: Array<{ name: string; url?: string }>;
}

export interface SearchBlock {
  /** Breadcrumb path */
  breadcrumbs: string[];
  /** URL to the content */
  href: string;
  /** Plaintext content for search */
  content: string;
  /** Search ranking (lower = higher priority) */
  rank: number;
}

export interface SearchBlockGroup {
  /** Group breadcrumbs */
  breadcrumbs: string[];
  /** Blocks in this group */
  blocks: SearchBlock[];
}
