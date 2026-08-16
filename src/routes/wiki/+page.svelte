<script lang="ts">
  import TableOfContents from "$lib/components/TableOfContents.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.title} | CUCaTS</title>
  {#if data.description}
    <meta name="description" content={data.description} />
  {/if}
</svelte:head>

<main class="bg-primary-900 min-h-screen">
  <section class="pt-16 text-neutral-200">
    <div class="mx-auto max-w-5xl px-4 py-12">
      <div class="flex gap-8">
        <div class="min-w-0 flex-1">
          <h1 class="h1 mb-4 font-bold">{data.title}</h1>

          <div class="prose prose-lg prose-invert mb-12 max-w-none">
            {@html data.html}
          </div>

          {#if data.children.length > 0}
            <nav class="grid gap-4 sm:grid-cols-2">
              {#each data.children as child}
                <a
                  href="/{child.slug}"
                  class="bg-primary-800 block rounded-lg p-6 transition-all hover:brightness-125"
                >
                  <h2
                    class="mb-2 text-lg font-semibold text-neutral-100 sm:text-xl"
                  >
                    {child.title}
                  </h2>
                  {#if child.description}
                    <p class="p text-neutral-200">{child.description}</p>
                  {/if}
                </a>
              {/each}
            </nav>
          {/if}
        </div>

        <TableOfContents sections={data.sections} />
      </div>
    </div>
  </section>
</main>
