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

<main class="bg-secondary-900 min-h-screen">
  <section class="bg-secondary-800 pt-24 text-neutral-300">
    <div class="mx-auto max-w-4xl px-4 py-12">
      <!-- Breadcrumb navigation -->
      <nav class="text-secondary-300 mb-6 text-sm">
        <a href="/" class="hover:text-primary-400 hover:underline">Home</a>
        <span class="mx-2">/</span>
        <span class="text-neutral-100">Blog</span>
      </nav>

      <h1 class="mb-2 text-4xl font-bold text-neutral-100">Blog</h1>
      <p class="text-secondary-300 mb-8">
        News, tutorials, and updates from CUCaTS
      </p>

      <div class="space-y-6">
        {#each data.posts as post}
          <article
            class="group bg-secondary-700 hover:bg-secondary-600 rounded-lg p-6 transition-colors"
          >
            <a href="/blog/{post.slug}" class="block">
              <div
                class="text-secondary-300 mb-2 flex items-center gap-3 text-xs"
              >
                {#if post.date_formatted}
                  <time datetime={post.date}>{post.date_formatted}</time>
                {/if}
                {#if post.authors.length > 0}
                  <span class="text-secondary-400">•</span>
                  <span>{post.authors.map((a) => a.name).join(", ")}</span>
                {/if}
              </div>
              <h2
                class="group-hover:text-primary-400 mb-2 text-xl font-semibold text-neutral-100"
              >
                {post.title}
              </h2>
              {#if post.description}
                <p class="text-secondary-200 text-sm">{post.description}</p>
              {/if}
              <span
                class="text-primary-400 mt-3 inline-block text-sm group-hover:underline"
                >Read more →</span
              >
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
