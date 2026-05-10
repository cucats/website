<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import { variantLabel } from "$lib/utils";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  function toLocalInput(d: Date | string): string {
    const date = d instanceof Date ? d : new Date(d);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  const variantsByProduct = $derived(
    Object.groupBy(data.variants, (v) => v.product_id),
  );
</script>

<a class="text-sm text-neutral-400 hover:text-neutral-100" href="/admin/drops">
  ← Drops
</a>
<h1 class="h2 mt-2 mb-6 text-neutral-100">{data.drop.name}</h1>

{#if form?.error}
  <p class="helper-text error mb-4">{form.error}</p>
{/if}

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Drop details</h2>
  <form method="POST" action="?/update" class="c-4 max-w-lg">
    <label>
      Slug
      <input class="default" type="text" value={data.drop.slug} disabled />
    </label>
    <label>
      Name
      <input class="default" type="text" name="name" value={data.drop.name} required />
    </label>
    <label>
      Description
      <textarea
        class="default min-h-24"
        name="description"
        rows="3">{data.drop.description ?? ""}</textarea>
    </label>
    <label>
      Opens at
      <input
        class="default"
        type="datetime-local"
        name="opens_at"
        value={toLocalInput(data.drop.opens_at)}
        required
      />
    </label>
    <label>
      Closes at
      <input
        class="default"
        type="datetime-local"
        name="closes_at"
        value={toLocalInput(data.drop.closes_at)}
        required
      />
    </label>
    <label>
      Collection event
      <input
        class="default"
        type="text"
        name="collection_event"
        value={data.drop.collection_event ?? ""}
      />
    </label>
    <label>
      Status
      <select class="default" name="status" value={data.drop.status}>
        <option value="draft">draft</option>
        <option value="open">open</option>
        <option value="closed">closed</option>
        <option value="fulfilled">fulfilled</option>
        <option value="cancelled">cancelled</option>
      </select>
    </label>
    <div class="r-4">
      <button class="btn primary md">Save</button>
    </div>
  </form>
  <div class="r-4 mt-4">
    <a class="btn neutral sm" href="/admin/drops/{data.drop.id}/export.csv">
      Download supplier CSV
    </a>
    <form method="POST" action="?/destroy">
      <button
        class="btn neutral sm text-error-400"
        onclick={(e) => {
          if (!confirm("Delete this drop and all its products?")) e.preventDefault();
        }}
      >
        Delete drop
      </button>
    </form>
  </div>
</section>

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Products</h2>
  {#if data.products.length === 0}
    <p class="p text-neutral-400">No products yet.</p>
  {:else}
    <ul class="c-4">
      {#each data.products as product, i}
        <li class="rounded-lg border border-neutral-800 p-4">
          <div class="r-4 mb-3 items-start justify-between">
            <div class="r-4 items-start">
              {#if product.image_url}
                <img
                  src={product.image_url}
                  alt={product.name}
                  class="size-20 rounded object-cover"
                />
              {/if}
              <div>
                <p class="font-medium text-neutral-100">{product.name}</p>
                {#if product.description}
                  <p class="text-sm text-neutral-400">{product.description}</p>
                {/if}
              </div>
            </div>
            <div class="r-2">
              <form method="POST" action="?/moveProductUp">
                <input type="hidden" name="product_id" value={product.id} />
                <button
                  class="btn neutral sm"
                  aria-label="Move up"
                  disabled={i === 0}>↑</button
                >
              </form>
              <form method="POST" action="?/moveProductDown">
                <input type="hidden" name="product_id" value={product.id} />
                <button
                  class="btn neutral sm"
                  aria-label="Move down"
                  disabled={i === data.products.length - 1}>↓</button
                >
              </form>
              <form method="POST" action="?/deleteProduct">
                <input type="hidden" name="product_id" value={product.id} />
                <button
                  class="btn neutral sm text-error-400"
                  onclick={(e) => {
                    if (!confirm("Delete this product?")) e.preventDefault();
                  }}
                >
                  Delete
                </button>
              </form>
            </div>
          </div>

          <div class="ml-4 border-l-2 border-neutral-800 pl-4">
            <p class="mb-2 text-sm text-neutral-400">Variants</p>
            {#if (variantsByProduct[product.id] ?? []).length === 0}
              <p class="mb-2 text-sm text-neutral-500">None.</p>
            {:else}
              <ul class="c-2 mb-3">
                {#each variantsByProduct[product.id] ?? [] as v}
                  <li class="r-4 items-center justify-between text-sm">
                    <span class="text-neutral-200">
                      {variantLabel(v.options)} ・ £{v.price.toFixed(2)} ・ stock:
                      {v.stock_count ?? "∞"}
                    </span>
                    <form method="POST" action="?/deleteVariant">
                      <input type="hidden" name="variant_id" value={v.id} />
                      <button class="btn neutral sm text-error-400">×</button>
                    </form>
                  </li>
                {/each}
              </ul>
            {/if}
            <form method="POST" action="?/addVariant" class="r-4 items-end">
              <input type="hidden" name="product_id" value={product.id} />
              <label class="flex-1">
                Options
                <input
                  class="default"
                  type="text"
                  name="options"
                  placeholder="size=M, colour=Black"
                />
              </label>
              <label>
                Price (£)
                <input
                  class="default"
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Stock (blank=∞)
                <input class="default" type="number" name="stock_count" min="0" />
              </label>
              <button class="btn neutral sm">Add</button>
            </form>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<section>
  <h2 class="h4 mb-3 text-neutral-100">Add product</h2>
  <form
    method="POST"
    action="?/addProduct"
    enctype="multipart/form-data"
    class="c-4 max-w-lg"
  >
    <label>
      Name
      <input class="default" type="text" name="name" required />
    </label>
    <label>
      Description
      <textarea class="default min-h-20" name="description" rows="2"></textarea>
    </label>
    <label>
      Image
      <input
        class="default"
        type="file"
        name="image"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
      />
    </label>
    <button class="btn primary md">Add product</button>
  </form>
</section>
