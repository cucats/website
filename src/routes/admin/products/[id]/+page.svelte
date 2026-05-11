<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import { variantLabel } from "$lib/utils";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const hasVariants = $derived(data.variants.length > 0);
</script>

<a class="text-sm text-neutral-400 hover:text-neutral-100" href="/admin/products">
  ← Products
</a>
<h1 class="h2 mt-2 mb-6 text-neutral-100">{data.product.name}</h1>

{#if form?.error}
  <p class="helper-text error mb-4">{form.error}</p>
{/if}

{#if !hasVariants}
  <p class="helper-text mb-6">
    This product has no variants yet — members can't order it until you add at
    least one.
  </p>
{/if}

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Details</h2>
  <form
    method="POST"
    action="?/update"
    enctype="multipart/form-data"
    autocomplete="off"
    class="c-4 max-w-xl"
  >
    <label for="product-title">
      Title
      <input
        id="product-title"
        class="default"
        type="text"
        name="title"
        autocomplete="off"
        data-form-type="other"
        data-lpignore="true"
        value={data.product.name}
        required
      />
    </label>
    <label for="product-description">
      Description
      <textarea
        id="product-description"
        class="default min-h-20"
        name="description"
        autocomplete="off"
        data-form-type="other"
        data-lpignore="true"
        rows="3">{data.product.description ?? ""}</textarea>
    </label>
    <div class="r-4 items-end">
      {#if data.product.image_url}
        <img
          src={data.product.image_url}
          alt={data.product.name}
          class="size-20 rounded object-cover"
        />
      {/if}
      <label class="flex-1">
        {data.product.image_url ? "Replace image" : "Image"}
        <input
          class="default"
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        />
      </label>
    </div>
    <button class="btn primary md self-start">Save</button>
  </form>
  <form method="POST" action="?/destroy" class="mt-4">
    <button
      class="btn neutral sm text-error-400"
      onclick={(e) => {
        if (!confirm("Delete this product? It will be removed from any showcase."))
          e.preventDefault();
      }}
    >
      Delete product
    </button>
  </form>
</section>

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Showcases</h2>
  {#if data.showcases.length === 0}
    <p class="p mb-3 text-neutral-400">Not in any showcase yet.</p>
  {:else}
    <ul class="c-2 mb-3">
      {#each data.showcases as s}
        <li class="r-2 items-center justify-between text-sm">
          <a
            class="text-neutral-200 hover:text-neutral-100"
            href="/admin/showcases/{s.id}"
          >
            {s.name}
            <span class="text-neutral-500"
              >({s.kind === "drop" ? "drop" : "always on"})</span
            >
          </a>
          <form method="POST" action="?/removeFromShowcase">
            <input type="hidden" name="showcase_id" value={s.id} />
            <button class="btn neutral sm text-error-400">Remove</button>
          </form>
        </li>
      {/each}
    </ul>
  {/if}
  {#if data.availableShowcases.length > 0}
    <form
      method="POST"
      action="?/addToShowcase"
      class="r-2 max-w-md items-end"
    >
      <label class="flex-1">
        Add to showcase
        <select class="default" name="showcase_id" required>
          {#each data.availableShowcases as s}
            <option value={s.id}>
              {s.name}{s.kind === "always_on" ? " (always on)" : ""}
            </option>
          {/each}
        </select>
      </label>
      <button class="btn neutral sm">Add</button>
    </form>
  {/if}
</section>

<section>
  <h2 class="h4 mb-3 text-neutral-100">Variants</h2>
  {#if data.variants.length === 0}
    <p class="p mb-3 text-neutral-400">No variants yet — add one below.</p>
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

  <details class="mb-3" open={!hasVariants}>
    <summary class="cursor-pointer text-sm text-neutral-300">
      Quick add — size run
    </summary>
    <form
      method="POST"
      action="?/addVariantRun"
      autocomplete="off"
      class="r-4 mt-2 max-w-2xl items-end"
    >
      <input type="hidden" name="option_key" value="size" />
      <label class="flex-1">
        Sizes (comma-separated)
        <input
          class="default"
          type="text"
          name="values"
          value="S, M, L, XL, 2XL"
          autocomplete="off"
          data-lpignore="true"
          required
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
        Stock per size
        <input class="default" type="number" name="stock_count" min="0" />
      </label>
      <button class="btn neutral sm">Add all</button>
    </form>
  </details>

  <details>
    <summary class="cursor-pointer text-sm text-neutral-300">
      Add single variant
    </summary>
    <form
      method="POST"
      action="?/addVariant"
      autocomplete="off"
      class="r-4 mt-2 max-w-2xl items-end"
    >
      <label class="flex-1">
        Options
        <input
          class="default"
          type="text"
          name="options"
          placeholder="size=M, colour=Black"
          autocomplete="off"
          data-lpignore="true"
        />
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
  </details>
</section>
