<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.title} | CUCaTS Blog</title>
  {#if data.description}
    <meta name="description" content={data.description} />
  {/if}
</svelte:head>

<main class="bg-secondary-900 min-h-screen">
  <section class="bg-secondary-800 pt-24 text-neutral-300">
    <div class="mx-auto max-w-4xl px-4 py-12">
      <!-- Breadcrumb navigation -->
      <nav class="mb-6 text-sm text-secondary-300">
        <a href="/" class="hover:text-primary-400 hover:underline">Home</a>
        <span class="mx-2">/</span>
        <a href="/blog" class="hover:text-primary-400 hover:underline">Blog</a>
        <span class="mx-2">/</span>
        <span class="text-neutral-100">{data.title}</span>
      </nav>

      <article>
        <header class="mb-8">
          <h1 class="mb-4 text-4xl font-bold text-neutral-100">{data.title}</h1>
          <div
            class="flex flex-wrap items-center gap-4 text-sm text-secondary-300"
          >
            {#if data.date_formatted}
              <time datetime={data.date}>{data.date_formatted}</time>
            {/if}
            {#if data.authors.length > 0}
              <span class="text-secondary-400">•</span>
              <span>
                by {#each data.authors as author, i}
                  {#if author.url}
                    <a
                      href={author.url}
                      class="text-primary-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer">{author.name}</a
                    >
                  {:else}
                    {author.name}
                  {/if}
                  {#if i < data.authors.length - 1},
                  {/if}
                {/each}
              </span>
            {/if}
          </div>
        </header>

        <div class="prose prose-lg prose-invert max-w-none">
          {@html data.html}
        </div>
      </article>

      <!-- Post navigation -->
      <nav
        class="mt-12 grid gap-4 border-t border-secondary-600 pt-8 sm:grid-cols-2"
      >
        {#if data.prev}
          <a
            href="/blog/{data.prev.slug}"
            class="group bg-secondary-700 hover:border-primary-500 hover:bg-secondary-600 rounded-lg border border-secondary-500 p-4 transition-colors"
          >
            <span class="text-xs text-secondary-300">← Previous</span>
            <span class="text-primary-400 block group-hover:underline"
              >{data.prev.title}</span
            >
          </a>
        {:else}
          <div></div>
        {/if}
        {#if data.next}
          <a
            href="/blog/{data.next.slug}"
            class="group bg-secondary-700 hover:border-primary-500 hover:bg-secondary-600 rounded-lg border border-secondary-500 p-4 text-right transition-colors"
          >
            <span class="text-xs text-secondary-300">Next →</span>
            <span class="text-primary-400 block group-hover:underline"
              >{data.next.title}</span
            >
          </a>
        {:else}
          <div></div>
        {/if}
      </nav>

      <!-- Back to blog -->
      <div class="mt-8 text-center">
        <a
          href="/blog"
          class="hover:text-primary-400 inline-flex items-center gap-2 text-sm text-secondary-300"
        >
          ← Back to all posts
        </a>
      </div>
    </div>
  </section>
</main>
