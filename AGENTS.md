# AGENTS.md

SvelteKit website for CUCaTS (`@cucats/website`). Uses Bun, Svelte 5, TypeScript, Tailwind CSS 4.

## Commands

- `bun run dev` — dev server
- `bun run build` — production build
- `bun run check` — typecheck / svelte-check (run after changes)
- `bun run format` — format with Prettier

## Structure

- `src/routes/` — pages
- `src/lib/` — components and libraries
- `src/content/` — content data
- `static/` — static assets

## Conventions

- Svelte 5 runes syntax (`$state`, `$derived`, `$props`)
- Format code with Prettier before committing
- No comments unless necessary
