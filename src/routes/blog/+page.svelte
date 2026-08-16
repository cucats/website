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

<main class="bg-primary-900 min-h-screen">
  <section class="pt-16 text-neutral-200">
    <div class="mx-auto max-w-5xl px-4 py-12">
      <h1 class="h1 mb-4 font-bold">Blog</h1>
      <p class="p mb-12 text-neutral-200">
        News, tutorials, and updates from CUCaTS
      </p>

      <div class="space-y-6">
        {#each data.posts as post}
          <article
            class="transition bg-primary-800 hover:brightness-125 rounded-lg"
          >
            <a href="/blog/{post.slug}" class="block p-6">
              <div class="mb-2 flex items-center gap-3 text-xs">
                {#if post.date_formatted}
                  <time datetime={post.date}>{post.date_formatted}</time>
                {/if}
                {#if post.authors.length > 0}
                  <span> {post.authors.map((a) => a.name).join(", ")}</span>
                {/if}
              </div>
              <h2 class="mb-2 text-xl font-semibold text-neutral-100">
                {post.title}
              </h2>
              {#if post.description}
                <p class="text-sm">{post.description}</p>
              {/if}
            </a>
          </article>
        {/each}
      </div>

      {#if data.posts.length === 0}
        <p class="text-neutral-200">No blog posts yet. Check back soon!</p>
      {/if}
    </div>
  </section>
</main>
