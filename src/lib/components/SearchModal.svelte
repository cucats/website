<script lang="ts">
  import { onMount } from "svelte";
  import { goto, afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { init, search, inited, lookup } from "$lib/search";
  import { searchState } from "$lib/search-state.svelte";
  import type {
    SearchBlockGroup,
    SearchBlock,
  } from "$lib/server/content/types";

  let results: SearchBlockGroup[] = $state([]);
  let recentResults: SearchBlock[] = $state([]);
  let selectedIndex = $state(0);
  let inputElement: HTMLInputElement | undefined = $state();

  // Flatten results for keyboard navigation
  let flatResults = $derived(results.flatMap((group) => group.blocks));

  onMount(() => {
    // Load search index
    if (!inited) {
      fetch("/content.json")
        .then((response) => response.json())
        .then(({ blocks }) => {
          init(blocks);
          searchState.ready = true;
          updateRecentResults();
        })
        .catch((e) => console.error("Failed to load search index:", e));
    } else {
      searchState.ready = true;
      updateRecentResults();
    }

    // Listen for Ctrl+K / Cmd+K
    function handleGlobalKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchState.toggle();
      }

      if (e.key === "Escape" && searchState.active) {
        e.preventDefault();
        close();
      }
    }

    document.addEventListener("keydown", handleGlobalKeydown);
    return () => document.removeEventListener("keydown", handleGlobalKeydown);
  });

  afterNavigate(() => {
    close();
  });

  function updateRecentResults() {
    if (!searchState.ready) return;
    recentResults = searchState.recent
      .map(lookup)
      .filter(Boolean) as SearchBlock[];
  }

  $effect(() => {
    if (searchState.active) {
      setTimeout(() => inputElement?.focus(), 0);
      updateRecentResults();
    }
  });

  $effect(() => {
    if (searchState.query.trim()) {
      results = search(searchState.query, page.url.pathname);
      selectedIndex = 0;
    } else {
      results = [];
    }
  });

  function handleKeydown(e: KeyboardEvent) {
    const items = searchState.query.trim() ? flatResults : recentResults;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === "Enter" && items[selectedIndex]) {
      e.preventDefault();
      navigateTo(items[selectedIndex].href);
    }
  }

  function navigateTo(href: string) {
    searchState.addRecent(href);
    close();
    goto(href);
  }

  function close() {
    searchState.close();
    results = [];
    selectedIndex = 0;
  }

  function removeRecent(href: string, e: Event) {
    e.stopPropagation();
    searchState.removeRecent(href);
    updateRecentResults();
  }
</script>

{#if searchState.active && searchState.ready}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
    onclick={close}
    onkeydown={(e) => e.key === "Escape" && close()}
    role="button"
    tabindex="-1"
    aria-label="Close search"
  ></div>

  <!-- Modal -->
  <div
    class="fixed top-20 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-4"
  >
    <div
      class="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl"
    >
      <!-- Search input -->
      <div class="flex items-center gap-3 border-b border-neutral-700 px-4">
        <svg
          class="h-5 w-5 shrink-0 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          bind:this={inputElement}
          bind:value={searchState.query}
          onkeydown={handleKeydown}
          type="text"
          placeholder="Search blog and wiki..."
          class="w-full bg-transparent py-4 text-lg text-neutral-100 outline-none placeholder:text-neutral-500"
        />
        <kbd
          class="hidden shrink-0 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-neutral-400 sm:block"
        >
          ESC
        </kbd>
      </div>

      <!-- Results -->
      <div class="max-h-96 overflow-y-auto">
        {#if results.length > 0}
          <div class="p-2">
            {#each results as group}
              <div class="mb-2">
                <div
                  class="px-3 py-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase"
                >
                  {group.breadcrumbs.join(" / ")}
                </div>
                {#each group.blocks as block}
                  {@const globalIndex = flatResults.indexOf(block)}
                  <button
                    onclick={() => navigateTo(block.href)}
                    class="w-full rounded-lg px-3 py-2 text-left transition-colors {globalIndex ===
                    selectedIndex
                      ? 'bg-primary-600 text-neutral-100'
                      : 'text-neutral-300 hover:bg-neutral-800'}"
                  >
                    <div class="font-medium">{block.breadcrumbs.at(-1)}</div>
                    {#if block.content}
                      <div
                        class="truncate text-sm {globalIndex === selectedIndex
                          ? 'text-neutral-200'
                          : 'text-neutral-500'}"
                      >
                        {block.content.slice(0, 100)}...
                      </div>
                    {/if}
                  </button>
                {/each}
              </div>
            {/each}
          </div>
        {:else if searchState.query.trim()}
          <div class="p-8 text-center text-neutral-500">
            No results found for "{searchState.query}"
          </div>
        {:else if recentResults.length > 0}
          <div class="p-2">
            <div
              class="px-3 py-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase"
            >
              Recent searches
            </div>
            {#each recentResults as block, i}
              <div
                class="group flex items-center rounded-lg transition-colors {i ===
                selectedIndex
                  ? 'bg-primary-600'
                  : 'hover:bg-neutral-800'}"
              >
                <button
                  onclick={() => navigateTo(block.href)}
                  class="flex-1 px-3 py-2 text-left {i === selectedIndex
                    ? 'text-neutral-100'
                    : 'text-neutral-300'}"
                >
                  <div class="font-medium">{block.breadcrumbs.at(-1)}</div>
                  <div
                    class="text-xs {i === selectedIndex
                      ? 'text-neutral-200'
                      : 'text-neutral-500'}"
                  >
                    {block.breadcrumbs.slice(0, -1).join(" / ")}
                  </div>
                </button>
                <button
                  onclick={(e) => removeRecent(block.href, e)}
                  class="mr-2 rounded p-2 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-neutral-700 hover:text-neutral-300"
                  aria-label="Remove from recent"
                >
                  <svg
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            {/each}
          </div>
        {:else}
          <div class="p-8 text-center text-neutral-500">
            Start typing to search...
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-between border-t border-neutral-700 px-4 py-2 text-xs text-neutral-500"
      >
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1">
            <kbd
              class="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5"
              >↑</kbd
            >
            <kbd
              class="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5"
              >↓</kbd
            >
            <span class="ml-1">navigate</span>
          </div>
          <div class="flex items-center gap-1">
            <kbd
              class="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5"
              >↵</kbd
            >
            <span class="ml-1">select</span>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <kbd
            class="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5"
            >esc</kbd
          >
          <span class="ml-1">close</span>
        </div>
      </div>
    </div>
  </div>
{/if}
