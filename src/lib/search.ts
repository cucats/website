import flexsearch from "flexsearch";
import type { SearchBlock, SearchBlockGroup } from "$lib/server/content/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Index = (flexsearch as any).Index ?? flexsearch;

export let inited = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let indexes: any[];
const map = new Map<string, SearchBlock>();

/**
 * Initialize the search index with content blocks
 */
export function init(blocks: SearchBlock[]) {
  if (inited) return;

  // Create multiple indexes for different ranking tiers
  const max_rank = Math.max(...blocks.map((block) => block.rank ?? 0));

  indexes = Array.from(
    { length: max_rank + 1 },
    () => new Index({ tokenize: "forward" }),
  );

  for (const block of blocks) {
    const title = block.breadcrumbs.at(-1) ?? "";
    map.set(block.href, block);
    indexes[block.rank ?? 0].add(block.href, `${title} ${block.content}`);
  }

  inited = true;
}

const CURRENT_SECTION_BOOST = 2;
const EXACT_MATCH_BOOST = 10;
const WORD_MATCH_BOOST = 4;
const NEAR_MATCH_BOOST = 2;
const BREADCRUMB_LENGTH_BOOST = 0.2;

interface Entry {
  block: SearchBlock;
  score: number;
  rank: number;
}

/**
 * Search for a query in the index
 */
export function search(query: string, path: string): SearchBlockGroup[] {
  if (!inited || !query.trim()) return [];

  const escaped = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const exact_match = new RegExp(`^${escaped}$`, "i");
  const word_match = new RegExp(`(^|\\b)${escaped}($|\\b)`, "i");
  const near_match = new RegExp(`(^|\\b)${escaped}`, "i");

  const parts = path.split("/");

  const blocks = indexes
    .flatMap((index) => index.search(query) as string[])
    .map((href) => map.get(href)!)
    .filter(Boolean)
    .map((block, rank) => {
      const block_parts = block.href.split("/");

      // Prioritize current section
      let score = block_parts.findIndex((part, i) => part !== parts[i]);
      if (score === -1) score = block_parts.length;
      score *= CURRENT_SECTION_BOOST;

      // Boost exact/word/near matches in breadcrumbs
      if (block.breadcrumbs.some((text) => exact_match.test(text))) {
        score += EXACT_MATCH_BOOST;
      } else if (block.breadcrumbs.some((text) => word_match.test(text))) {
        score += WORD_MATCH_BOOST;
      } else if (block.breadcrumbs.some((text) => near_match.test(text))) {
        score += NEAR_MATCH_BOOST;
      }

      // Prioritize broader results (shorter breadcrumb paths)
      score -= block.breadcrumbs.length * BREADCRUMB_LENGTH_BOOST;

      const entry: Entry = { block, score, rank };
      return entry;
    });

  // Group results by top-level category
  const grouped: Record<string, { breadcrumbs: string[]; entries: Entry[] }> =
    {};

  for (const entry of blocks) {
    const breadcrumbs = entry.block.breadcrumbs.slice(0, 2);
    const key = breadcrumbs.join("::");
    const group = (grouped[key] ??= { breadcrumbs, entries: [] });
    group.entries.push(entry);
  }

  const sorted = Object.values(grouped);

  // Sort blocks within groups
  for (const group of sorted) {
    group.entries.sort((a, b) => b.score - a.score || a.rank - b.rank);
  }

  // Sort groups by best result
  sorted.sort((a, b) => b.entries[0].score - a.entries[0].score);

  return sorted.map((group) => ({
    breadcrumbs: group.breadcrumbs,
    blocks: group.entries.map((entry) => entry.block),
  }));
}

/**
 * Get a block by its href
 */
export function lookup(href: string): SearchBlock | undefined {
  return map.get(href);
}
