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

<main class="bg-primary-900 min-h-screen">
  <section class="pt-16 text-neutral-100">
    <div class="mx-auto max-w-4xl px-4 py-12">
      <!-- Breadcrumb navigation -->
      <nav class="mb-6 text-sm text-neutral-400 font-mono">
        <a href="/blog" class="hover:text-neutral-200 hover:underline">Blog</a>
        <span class="mx-1">/</span>
        <span class="text-neutral-200">{data.title}</span>
      </nav>

      <article>
        <header class="mb-8">
          <h1 class="h1 mb-4">{data.title}</h1>
          <div class="flex flex-wrap items-center gap-6 text-sm">
            {#if data.date_formatted}
              <time datetime={data.date}>{data.date_formatted}</time>
            {/if}
            {#if data.authors.length > 0}
              <span>
                {#each data.authors as author, i}
                  {#if author.url}
                    <a
                      href={author.url}
                      class="hover:underline"
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

        <div class="prose max-w-none">
          {@html data.html}
        </div>
      </article>

      <!-- Back to blog -->
      <div class="mt-8 text-center">
        <a
          href="/blog"
          class="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200"
        >
          &lt;- Back to all posts
        </a>
      </div>
    </div>
  </section>
</main>
