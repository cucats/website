<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import { variantLabel } from "$lib/utils";

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<a class="text-sm text-neutral-400 hover:text-neutral-100" href="/admin/pod">
  ← Order anytime
</a>
<h1 class="h2 mt-2 mb-6 text-neutral-100">{data.product.name}</h1>

{#if form?.error}
  <p class="helper-text error mb-4">{form.error}</p>
{/if}

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Product</h2>
  <form method="POST" action="?/update" class="c-4 max-w-lg">
    <label>
      Name
      <input class="default" type="text" name="name" value={data.product.name} required />
    </label>
    <label>
      Description
      <textarea class="default min-h-20" name="description" rows="2"
        >{data.product.description ?? ""}</textarea>
    </label>
    <button class="btn primary md">Save</button>
  </form>
  {#if data.product.image_url}
    <div class="mt-4">
      <p class="mb-1 text-sm text-neutral-400">Current image</p>
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
        if (!confirm("Delete this product?")) e.preventDefault();
      }}
    >
      Delete product
    </button>
  </form>
</section>

<section>
  <h2 class="h4 mb-3 text-neutral-100">Variants</h2>
  {#if data.variants.length === 0}
    <p class="p text-neutral-400">None yet.</p>
  {:else}
    <ul class="c-2 mb-4">
      {#each data.variants as v}
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
