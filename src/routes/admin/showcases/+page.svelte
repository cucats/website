<script lang="ts">
  import type { PageData, ActionData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const alwaysOn = $derived(data.showcases.filter((s) => s.kind === "always_on"));
  const drops = $derived(data.showcases.filter((s) => s.kind === "drop"));
</script>

<h1 class="h2 mb-6 text-neutral-100">Showcases</h1>

{#if alwaysOn.length > 0}
  <section class="mb-10">
    <h2 class="h4 mb-3 text-neutral-100">Always on</h2>
    <ul class="c-2 divide-y divide-neutral-800">
      {#each alwaysOn as s}
        <li class="r-4 items-center justify-between py-3">
          <div>
            <a class="font-medium text-neutral-100" href="/admin/showcases/{s.id}">
              {s.name}
            </a>
            <p class="text-xs text-neutral-400">
              {s.slug} ・ {s.product_count} product{s.product_count === 1 ? "" : "s"}
            </p>
          </div>
          <a class="btn neutral sm" href="/admin/showcases/{s.id}">Edit</a>
        </li>
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
      {#each drops as s}
        <li class="r-4 items-center justify-between py-3">
          <div>
            <a class="font-medium text-neutral-100" href="/admin/showcases/{s.id}">
              {s.name}
            </a>
            <p class="text-xs text-neutral-400">
              {s.slug} ・ {s.status} ・ {s.product_count} product{s.product_count === 1
                ? ""
                : "s"}
              {#if s.closes_at}
                ・ closes {new Date(s.closes_at).toLocaleString("en-GB")}
              {/if}
            </p>
          </div>
          <a class="btn neutral sm" href="/admin/showcases/{s.id}">Edit</a>
        </li>
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
