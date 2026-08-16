<script lang="ts">
  import TableOfContents from "$lib/components/TableOfContents.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.title} | CUCaTS Wiki</title>
  {#if data.description}
    <meta name="description" content={data.description} />
  {/if}
</svelte:head>

<main class="bg-primary-900 min-h-screen">
  <section class="pt-16 text-neutral-100">
    <div class="mx-auto max-w-5xl px-4 py-12">
      <div class="flex gap-8">
        <div class="min-w-0 flex-1">
          <article>
            <!-- Breadcrumbs -->
            {#if data.breadcrumbs.length > 0}
              <nav class="mb-6 text-sm text-neutral-400 font-mono">
                {#each data.breadcrumbs as crumb, i}
                  {#if i > 0}
                    <span class="float-left mx-2">/</span>
                  {/if}

                  <a
                    href="/{crumb.slug}"
                    class="float-left hover:text-neutral-200 hover:underline"
                    >{crumb.title}</a
                  >
                {/each}

                <span class="float-left mx-2">/</span>
                <span class="text-neutral-200">{data.title}</span>
              </nav>
            {/if}

            <h1 class="h1 mb-4 font-semibold">{data.title}</h1>

            <div class="prose max-w-none">
              {@html data.html}
            </div>
          </article>

          <!-- Child pages -->
          {#if data.children.length > 0}
            <nav class="mt-12 grid gap-4 sm:grid-cols-2">
              {#each data.children as child}
                <a
                  href="/{child.slug}"
                  class="bg-primary-800 block rounded-lg p-6 transition-all hover:brightness-125"
                >
                  <h2 class="card-title mb-1 font-semibold text-neutral-100">
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

        <!-- Table of contents -->
        <TableOfContents sections={data.sections} />
      </div>
    </div>
  </section>
</main>
