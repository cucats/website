<script lang="ts">
  import type { PageData, ActionData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const alwaysOn = $derived(data.showcases.filter((s) => s.kind === "always_on"));
  const drops = $derived(data.showcases.filter((s) => s.kind === "drop"));

  function preview(images: (string | null)[]): string[] {
    return images.filter((u): u is string => !!u).slice(0, 5);
  }
</script>

{#snippet row(s: (typeof data.showcases)[number])}
  {@const previews = preview(s.image_urls)}
  {@const extra = s.product_count - previews.length}
  <li class="r-4 items-center justify-between py-3">
    <div class="min-w-0">
      <a class="font-medium text-neutral-100" href="/admin/showcases/{s.id}">
        {s.name}
      </a>
      <p class="text-xs text-neutral-400">
        {#if s.kind === "drop"}
          {s.status}
          {#if s.closes_at}
            ・ closes {new Date(s.closes_at).toLocaleString("en-GB")}
          {/if}
        {:else}
          always on
        {/if}
        ・ {s.product_count} product{s.product_count === 1 ? "" : "s"}
      </p>
    </div>
    <div class="r-4 items-center">
      <div class="flex items-center">
        {#each previews as url, i}
          <img
            src={url}
            alt=""
            class="bg-primary-900 size-10 shrink-0 rounded-lg border-2 border-neutral-950 object-cover"
            class:-ml-3={i > 0}
            style="z-index: {previews.length - i}"
          />
        {/each}
        {#if extra > 0}
          <span
            class="bg-primary-900 -ml-3 grid size-10 shrink-0 place-items-center rounded-lg border-2 border-neutral-950 text-xs font-semibold text-neutral-300"
          >
            +{extra}
          </span>
        {/if}
      </div>
      <a class="btn neutral sm" href="/admin/showcases/{s.id}">Edit</a>
    </div>
  </li>
{/snippet}

<h1 class="h2 mb-6 text-neutral-100">Showcases</h1>

{#if alwaysOn.length > 0}
  <section class="mb-10">
    <h2 class="h4 mb-3 text-neutral-100">Always on</h2>
    <ul class="c-2 divide-y divide-neutral-800">
      {#each alwaysOn as s (s.id)}
        {@render row(s)}
      {/each}
    </ul>
  </section>
{/if}

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Drops</h2>
  {#if drops.length === 0}
    <p class="p text-neutral-400">No drops yet.</p>
  {:else}
    <ul class="c-2 divide-y divide-neutral-800">
      {#each drops as s (s.id)}
        {@render row(s)}
      {/each}
    </ul>
  {/if}
</section>

<section>
  <h2 class="h4 mb-3 text-neutral-100">Create drop</h2>
  {#if form?.error}
    <p class="helper-text error mb-3">{form.error}</p>
  {/if}
  <form method="POST" action="?/create" class="c-4 max-w-lg">
    <label>
      Slug
      <input class="default" type="text" name="slug" required pattern="[a-z0-9-]+" />
    </label>
    <label>
      Name
      <input class="default" type="text" name="name" required />
    </label>
    <label>
      Opens at
      <input class="default" type="datetime-local" name="opens_at" required />
    </label>
    <label>
      Closes at
      <input class="default" type="datetime-local" name="closes_at" required />
    </label>
    <label>
      Collection event
      <input class="default" type="text" name="collection_event" />
    </label>
    <button class="btn primary md">Create drop</button>
  </form>
</section>
