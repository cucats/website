<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.title} | CUCaTS</title>
  {#if data.description}
    <meta name="description" content={data.description} />
  {/if}
</svelte:head>

<main class="bg-secondary-900 min-h-screen">
  <section class="bg-secondary-800 pt-24 text-neutral-300">
    <div class="mx-auto max-w-4xl px-4 py-12">
      <!-- Breadcrumb navigation -->
      <nav class="text-secondary-300 mb-6 text-sm">
        <a href="/" class="hover:text-primary-400 hover:underline">Home</a>
        <span class="mx-2">/</span>
        <span class="text-neutral-100">Wiki</span>
      </nav>

      <h1 class="mb-8 text-4xl font-bold text-neutral-100">{data.title}</h1>

      <div class="prose prose-lg prose-invert mb-12 max-w-none">
        {@html data.html}
      </div>

      {#if data.children.length > 0}
        <nav class="grid gap-4 sm:grid-cols-2">
          {#each data.children as child}
            <a
              href="/wiki/{child.slug}"
              class="bg-secondary-700 hover:bg-secondary-600 block rounded-lg p-6 transition-colors"
            >
              <h2 class="mb-2 text-xl font-semibold text-neutral-100">
                {child.title}
              </h2>
              {#if child.description}
                <p class="text-secondary-300">{child.description}</p>
              {/if}
            </a>
          {/each}
        </nav>
      {/if}
    </div>
  </section>
</main>
