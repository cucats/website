<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.title} | CUCaTS Wiki</title>
  {#if data.description}
    <meta name="description" content={data.description} />
  {/if}
</svelte:head>

<main class="bg-secondary-900 min-h-screen">
  <section class="bg-secondary-800 pt-24 text-neutral-300">
    <div class="mx-auto max-w-4xl px-4 py-12">
      <!-- Breadcrumbs -->
      {#if data.breadcrumbs.length > 0}
        <nav class="mb-6 text-sm text-neutral-400">
          <a href="/wiki" class="hover:underline">Wiki</a>
          {#each data.breadcrumbs as crumb}
            <span class="mx-2">/</span>
            <span>{crumb.title}</span>
          {/each}
        </nav>
      {/if}

      <article>
        <h1 class="mb-8 text-4xl font-bold text-neutral-100">{data.title}</h1>

        <!-- Table of contents -->
        {#if data.sections.length > 0}
          <nav
            class="bg-secondary-700 mb-8 rounded-lg border border-neutral-600 p-4"
          >
            <h2 class="mb-2 font-semibold text-neutral-100">On this page</h2>
            <ul class="space-y-1">
              {#each data.sections as section}
                <li>
                  <a
                    href="#{section.slug}"
                    class="text-primary-400 hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              {/each}
            </ul>
          </nav>
        {/if}

        <div class="prose prose-lg prose-invert max-w-none">
          {@html data.html}
        </div>
      </article>

      <!-- Child pages -->
      {#if data.children.length > 0}
        <nav class="mt-12 grid gap-4 sm:grid-cols-2">
          {#each data.children as child}
            <a
              href="/wiki/{child.slug}"
              class="bg-secondary-700 hover:border-primary-500 hover:bg-secondary-600 block rounded-lg border border-neutral-600 p-6 transition-colors"
            >
              <h2 class="mb-2 text-xl font-semibold text-neutral-100">
                {child.title}
              </h2>
              {#if child.description}
                <p class="text-neutral-400">{child.description}</p>
              {/if}
            </a>
          {/each}
        </nav>
      {/if}

      <!-- Prev/Next navigation -->
      <nav class="mt-12 flex justify-between border-t border-neutral-600 pt-8">
        {#if data.prev}
          <a
            href="/wiki/{data.prev.slug}"
            class="text-primary-400 hover:underline"
          >
            ← {data.prev.title}
          </a>
        {:else}
          <span></span>
        {/if}
        {#if data.next}
          <a
            href="/wiki/{data.next.slug}"
            class="text-primary-400 hover:underline"
          >
            {data.next.title} →
          </a>
        {:else}
          <span></span>
        {/if}
      </nav>
    </div>
  </section>
</main>
