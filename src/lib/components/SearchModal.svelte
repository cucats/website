<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { init, search, inited } from "$lib/search";
  import type { SearchBlockGroup } from "$lib/server/content/types";

  let open = $state(false);
  let query = $state("");
  let results: SearchBlockGroup[] = $state([]);
  let selectedIndex = $state(0);
  let inputElement: HTMLInputElement;

  // Flatten results for keyboard navigation
  let flatResults = $derived(results.flatMap((group) => group.blocks));

  onMount(() => {
    // Load search index
    if (!inited) {
      fetch("/content.json")
        .then((response) => response.json())
        .then(({ blocks }) => init(blocks))
        .catch((e) => console.error("Failed to load search index:", e));
    }

    // Listen for Ctrl+K / Cmd+K
    function handleGlobalKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open = !open;
        if (open) {
          setTimeout(() => inputElement?.focus(), 0);
        }
      }

      if (e.key === "Escape" && open) {
        e.preventDefault();
        open = false;
      }
    }

    document.addEventListener("keydown", handleGlobalKeydown);
    return () => document.removeEventListener("keydown", handleGlobalKeydown);
  });

  function handleInput() {
    if (query.trim()) {
      results = search(query, $page.url.pathname);
      selectedIndex = 0;
    } else {
      results = [];
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, flatResults.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === "Enter" && flatResults[selectedIndex]) {
      e.preventDefault();
      navigateTo(flatResults[selectedIndex].href);
    }
  }

  function navigateTo(href: string) {
    open = false;
    query = "";
    results = [];
    goto(href);
  }

  function close() {
    open = false;
    query = "";
    results = [];
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
    onclick={close}
    onkeydown={(e) => e.key === "Escape" && close()}
    role="button"
    tabindex="-1"
  ></div>

  <!-- Modal -->
  <div class="fixed top-24 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 px-4">
    <div
      class="overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900"
    >
      <!-- Search input -->
      <div
        class="flex items-center border-b border-gray-200 px-4 dark:border-gray-700"
      >
        <svg
          class="h-5 w-5 text-gray-400"
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
          bind:value={query}
          oninput={handleInput}
          onkeydown={handleKeydown}
          type="text"
          placeholder="Search documentation..."
          class="w-full bg-transparent px-4 py-4 text-lg outline-none placeholder:text-gray-400"
        />
        <kbd
          class="hidden rounded bg-gray-100 px-2 py-1 text-xs text-gray-500 sm:block dark:bg-gray-800"
        >
          ESC
        </kbd>
      </div>

      <!-- Results -->
      {#if results.length > 0}
        <div class="max-h-96 overflow-y-auto p-2">
          {#each results as group}
            <div class="mb-2">
              <div
                class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase"
              >
                {group.breadcrumbs.join(" / ")}
              </div>
              {#each group.blocks as block, i}
                {@const globalIndex = flatResults.indexOf(block)}
                <button
                  onclick={() => navigateTo(block.href)}
                  class="w-full rounded-lg px-3 py-2 text-left transition-colors {globalIndex ===
                  selectedIndex
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'}"
                >
                  <div class="font-medium">{block.breadcrumbs.at(-1)}</div>
                  {#if block.content}
                    <div
                      class="truncate text-sm text-gray-500 dark:text-gray-400"
                    >
                      {block.content.slice(0, 100)}...
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          {/each}
        </div>
      {:else if query.trim()}
        <div class="p-8 text-center text-gray-500">
          No results found for "{query}"
        </div>
      {:else}
        <div class="p-8 text-center text-gray-500">
          Start typing to search...
        </div>
      {/if}

      <!-- Footer -->
      <div
        class="flex items-center justify-between border-t border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-700"
      >
        <div class="flex gap-2">
          <kbd class="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800"
            >↑↓</kbd
          >
          <span>to navigate</span>
        </div>
        <div class="flex gap-2">
          <kbd class="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">↵</kbd
          >
          <span>to select</span>
        </div>
      </div>
    </div>
  </div>
{/if}
