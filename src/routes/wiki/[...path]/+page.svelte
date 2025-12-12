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

<main class="bg-tertiary-800 min-h-screen">
  <section class="bg-tertiary-800 pt-24 text-neutral-300">
    <div class="mx-auto max-w-4xl px-4 py-12">
      <!-- Breadcrumbs -->
      {#if data.breadcrumbs.length > 0}
        <nav class="mb-6 text-sm text-neutral-400">
          <a href="/" class="float-left hover:text-neutral-200 hover:underline"
            >Home</a
          >

          {#each data.breadcrumbs as crumb}
            <span class="float-left mx-4">/</span>

            <a
              href="/{crumb.slug}"
              class="float-left hover:text-neutral-200 hover:underline"
              >{crumb.title}</a
            >
          {/each}

          <span class="float-left mx-4">/</span>
          <span class="text-neutral-200">{data.title}</span>
        </nav>
      {/if}

      <article>
        <h1 class="mb-8 text-4xl font-bold text-neutral-100">{data.title}</h1>

        <!-- Table of contents -->
        {#if data.sections.length > 0}
          <nav class="bg-tertiary-900 mb-8 rounded-lg p-4">
            <h2 class="mb-2 font-semibold text-neutral-100">On this page</h2>
            <ul class="space-y-1">
              {#each data.sections as section}
                <li>
                  <a
                    href="#{section.slug}"
                    class="text-neutral-400 hover:text-neutral-100 hover:underline"
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
              href="/{child.slug}"
              class="bg-tertiary-900 block rounded-lg p-6 transition-all hover:brightness-125"
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
      <nav class="mt-12 flex justify-between pt-8">
        {#if data.prev}
          <a
            href="/{data.prev.slug}"
            class="text-neutral-300 hover:text-neutral-100 hover:underline"
          >
            &lt;- {data.prev.title}
          </a>
        {:else}
          <span></span>
        {/if}
        {#if data.next}
          <a
            href="/{data.next.slug}"
            class="text-neutral-300 hover:text-neutral-100 hover:underline"
          >
            {data.next.title} -&gt;
          </a>
        {:else}
          <span></span>
        {/if}
      </nav>
    </div>
  </section>
</main>
