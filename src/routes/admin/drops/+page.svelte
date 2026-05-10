<script lang="ts">
  import type { PageData, ActionData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<h1 class="h2 mb-6 text-neutral-100">Drops</h1>

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Existing</h2>
  {#if data.drops.length === 0}
    <p class="p text-neutral-400">No drops yet.</p>
  {:else}
    <ul class="c-2 divide-y divide-neutral-800">
      {#each data.drops as drop}
        <li class="r-4 items-center justify-between py-3">
          <div>
            <a class="font-medium text-neutral-100" href="/admin/drops/{drop.id}">
              {drop.name}
            </a>
            <p class="text-sm text-neutral-400">
              {drop.slug} ・ {drop.status} ・ closes {new Date(
                drop.closes_at,
              ).toLocaleString("en-GB")}
            </p>
          </div>
          <a class="btn neutral sm" href="/admin/drops/{drop.id}">Edit</a>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<section>
  <h2 class="h4 mb-3 text-neutral-100">Create new</h2>
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
