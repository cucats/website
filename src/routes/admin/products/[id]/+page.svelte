<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import { variantLabel } from "$lib/utils";

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<a class="text-sm text-neutral-400 hover:text-neutral-100" href="/admin/products">
  ← Products
</a>
<h1 class="h2 mt-2 mb-6 text-neutral-100">{data.product.name}</h1>

{#if form?.error}
  <p class="helper-text error mb-4">{form.error}</p>
{/if}

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Product</h2>
  <form
    method="POST"
    action="?/update"
    enctype="multipart/form-data"
    class="c-4 max-w-lg"
  >
    <label>
      Name
      <input class="default" type="text" name="name" value={data.product.name} required />
    </label>
    <label>
      Description
      <textarea class="default min-h-20" name="description" rows="3"
        >{data.product.description ?? ""}</textarea>
    </label>
    <label>
      Replace image
      <input
        class="default"
        type="file"
        name="image"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
      />
    </label>
    <button class="btn primary md">Save</button>
  </form>
  {#if data.product.image_url}
    <div class="mt-4">
      <img
        src={data.product.image_url}
        alt={data.product.name}
        class="size-32 rounded object-cover"
      />
    </div>
  {/if}
  <form method="POST" action="?/destroy" class="mt-4">
    <button
      class="btn neutral sm text-error-400"
      onclick={(e) => {
        if (!confirm("Delete this product? It will be removed from any showcase.")) e.preventDefault();
      }}
    >
      Delete product
    </button>
  </form>
</section>

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Showcases</h2>
  {#if data.showcases.length === 0}
    <p class="p text-neutral-400">
      Not in any showcase. Add it via <a
        class="text-secondary-400 hover:text-secondary-200"
        href="/admin/showcases">Showcases</a
      >.
    </p>
  {:else}
    <ul class="c-1 text-sm">
      {#each data.showcases as s}
        <li>
          <a class="text-neutral-200 hover:text-neutral-100" href="/admin/showcases/{s.id}">
            {s.name} ({s.kind === "drop" ? "drop" : "always on"})
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<section>
  <h2 class="h4 mb-3 text-neutral-100">Variants</h2>
  {#if data.variants.length === 0}
    <p class="p text-neutral-400">None yet.</p>
  {:else}
    <ul class="c-2 mb-4">
      {#each data.variants as v, vi}
        <li class="r-2 items-center justify-between text-sm">
          <span
            class="text-neutral-200"
            class:line-through={!v.enabled}
            class:text-neutral-500={!v.enabled}
          >
            {variantLabel(v.options)} ・ £{v.price.toFixed(2)} ・ stock:
            {v.stock_count ?? "∞"}
            {#if !v.enabled}・ disabled{/if}
          </span>
          <div class="r-2">
            <form method="POST" action="?/moveVariantUp">
              <input type="hidden" name="variant_id" value={v.id} />
              <button class="btn neutral sm" aria-label="Move up" disabled={vi === 0}
                >↑</button
              >
            </form>
            <form method="POST" action="?/moveVariantDown">
              <input type="hidden" name="variant_id" value={v.id} />
              <button
                class="btn neutral sm"
                aria-label="Move down"
                disabled={vi === data.variants.length - 1}>↓</button
              >
            </form>
            <form method="POST" action="?/toggleVariantEnabled">
              <input type="hidden" name="variant_id" value={v.id} />
              <button class="btn neutral sm">
                {v.enabled ? "Disable" : "Enable"}
              </button>
            </form>
            <form method="POST" action="?/deleteVariant">
              <input type="hidden" name="variant_id" value={v.id} />
              <button class="btn neutral sm text-error-400">×</button>
            </form>
          </div>
        </li>
      {/each}
    </ul>
  {/if}

  <details class="mb-3">
    <summary class="cursor-pointer text-sm text-neutral-300">
      Quick add — size run
    </summary>
    <form
      method="POST"
      action="?/addVariantRun"
      class="r-4 mt-2 max-w-2xl items-end"
    >
      <input type="hidden" name="option_key" value="size" />
      <label class="flex-1">
        Sizes (comma-separated)
        <input class="default" type="text" name="values" value="S, M, L, XL, 2XL" required />
      </label>
      <label>
        Price (£)
        <input class="default" type="number" name="price" min="0" step="0.01" required />
      </label>
      <label>
        Stock per size
        <input class="default" type="number" name="stock_count" min="0" />
      </label>
      <button class="btn neutral sm">Add all</button>
    </form>
  </details>

  <form method="POST" action="?/addVariant" class="r-4 max-w-2xl items-end">
    <label class="flex-1">
      Options
      <input class="default" type="text" name="options" placeholder="size=M, colour=Black" />
    </label>
    <label>
      Price (£)
      <input class="default" type="number" name="price" min="0" step="0.01" required />
    </label>
    <label>
      Stock (blank=∞)
      <input class="default" type="number" name="stock_count" min="0" />
    </label>
    <button class="btn neutral sm">Add</button>
  </form>
</section>
