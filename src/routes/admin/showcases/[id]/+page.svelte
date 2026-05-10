<script lang="ts">
  import type { PageData, ActionData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  function toLocalInput(d: Date | string | null): string {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
</script>

<a class="text-sm text-neutral-400 hover:text-neutral-100" href="/admin/showcases">
  ← Showcases
</a>
<h1 class="h2 mt-2 mb-6 text-neutral-100">{data.showcase.name}</h1>

{#if form?.error}
  <p class="helper-text error mb-4">{form.error}</p>
{/if}

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">
    {data.showcase.kind === "drop" ? "Drop" : "Always-on"} details
  </h2>
  <form method="POST" action="?/update" class="c-4 max-w-lg">
    <label>
      Slug
      <input class="default" type="text" value={data.showcase.slug} disabled />
    </label>
    <label>
      Name
      <input class="default" type="text" name="name" value={data.showcase.name} required />
    </label>
    <label>
      Description
      <textarea class="default min-h-24" name="description" rows="3"
        >{data.showcase.description ?? ""}</textarea>
    </label>
    {#if data.showcase.kind === "drop"}
      <label>
        Opens at
        <input
          class="default"
          type="datetime-local"
          name="opens_at"
          value={toLocalInput(data.showcase.opens_at)}
          required
        />
      </label>
      <label>
        Closes at
        <input
          class="default"
          type="datetime-local"
          name="closes_at"
          value={toLocalInput(data.showcase.closes_at)}
          required
        />
      </label>
      <label>
        Collection event
        <input
          class="default"
          type="text"
          name="collection_event"
          value={data.showcase.collection_event ?? ""}
        />
      </label>
    {/if}
    <label>
      Status
      <select class="default" name="status" value={data.showcase.status}>
        <option value="draft">draft</option>
        <option value="open">open</option>
        <option value="closed">closed</option>
        <option value="fulfilled">fulfilled</option>
        <option value="cancelled">cancelled</option>
      </select>
    </label>
    <button class="btn primary md">Save</button>
  </form>

  <div class="r-4 mt-4">
    {#if data.showcase.kind === "drop"}
      <a class="btn neutral sm" href="/admin/showcases/{data.showcase.id}/export.csv">
        Download supplier CSV
      </a>
      <form method="POST" action="?/destroy">
        <button
          class="btn neutral sm text-error-400"
          onclick={(e) => {
            if (!confirm("Delete this showcase?")) e.preventDefault();
          }}
        >
          Delete showcase
        </button>
      </form>
    {/if}
  </div>
</section>

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Products in this showcase</h2>
  {#if data.products.length === 0}
    <p class="p text-neutral-400">None yet — add one below.</p>
  {:else}
    <ul class="c-2 mb-4">
      {#each data.products as p, i}
        <li class="r-2 items-center justify-between text-sm">
          <a
            class="r-3 items-center text-neutral-100 hover:text-neutral-300"
            href="/admin/products/{p.id}"
          >
            {#if p.image_url}
              <img src={p.image_url} alt={p.name} class="size-10 rounded object-cover" />
            {:else}
              <div class="size-10 rounded bg-neutral-800"></div>
            {/if}
            {p.name}
          </a>
          <div class="r-2">
            <form method="POST" action="?/moveProductUp">
              <input type="hidden" name="product_id" value={p.id} />
              <button
                class="btn neutral sm"
                aria-label="Move up"
                disabled={i === 0}>↑</button
              >
            </form>
            <form method="POST" action="?/moveProductDown">
              <input type="hidden" name="product_id" value={p.id} />
              <button
                class="btn neutral sm"
                aria-label="Move down"
                disabled={i === data.products.length - 1}>↓</button
              >
            </form>
            <form method="POST" action="?/removeProduct">
              <input type="hidden" name="product_id" value={p.id} />
              <button class="btn neutral sm text-error-400">Remove</button>
            </form>
          </div>
        </li>
      {/each}
    </ul>
  {/if}

  {#if data.available.length === 0}
    <p class="helper-text">All products are already in this showcase.</p>
  {:else}
    <form method="POST" action="?/addProduct" class="r-2 max-w-lg items-end">
      <label class="flex-1">
        Add product from catalogue
        <select class="default" name="product_id" required>
          {#each data.available as p}
            <option value={p.id}>{p.name}</option>
          {/each}
        </select>
      </label>
      <button class="btn neutral sm">Add</button>
    </form>
  {/if}
</section>
