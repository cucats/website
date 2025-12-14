<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Blog | CUCaTS</title>
  <meta
    name="description"
    content="News, tutorials, and updates from the Cambridge University Computing and Technology Society"
  />
</svelte:head>

<main class="bg-primary-800 min-h-screen">
  <section class="pt-24 text-neutral-300">
    <div class="mx-auto max-w-4xl px-4 py-12">
      <!-- Breadcrumb navigation -->
      <nav class="mb-6 text-sm text-neutral-400">
        <a href="/" class="hover:text-neutral-200 hover:underline">Home</a>
        <span class="mx-2">/</span>
        <span class="text-neutral-200">Blog</span>
      </nav>

      <h1 class="h1 mb-4 font-bold text-neutral-100">Blog</h1>
      <p class="p mb-8 text-neutral-200">
        News, tutorials, and updates from CUCaTS
      </p>

      <div class="space-y-6">
        {#each data.posts as post}
          <article
            class="group bg-tertiary-900 rounded-lg transition-all hover:brightness-125"
          >
            <a href="/blog/{post.slug}" class="block p-6">
              <div
                class="mb-2 flex items-center gap-3 text-xs text-neutral-300"
              >
                {#if post.date_formatted}
                  <time datetime={post.date}>{post.date_formatted}</time>
                {/if}
                {#if post.authors.length > 0}
                  <span>{post.authors.map((a) => a.name).join(", ")}</span>
                {/if}
              </div>
              <h2
                class="mb-2 text-xl font-semibold text-neutral-100 group-hover:text-neutral-50"
              >
                {post.title}
              </h2>
              {#if post.description}
                <p class="text-sm text-neutral-300">{post.description}</p>
              {/if}
            </a>
          </article>
        {/each}
      </div>

      {#if data.posts.length === 0}
        <p class="text-neutral-400">No blog posts yet. Check back soon!</p>
      {/if}
    </div>
  </section>
</main>
