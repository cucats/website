<script lang="ts">
  import type { PageData, ActionData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<h1 class="h2 mb-6 text-neutral-100">Products</h1>

<section class="mb-10">
  {#if data.products.length === 0}
    <p class="p text-neutral-400">No products yet.</p>
  {:else}
    <ul class="c-2 divide-y divide-neutral-800">
      {#each data.products as product}
        <li class="r-4 items-center justify-between py-3">
          <div class="r-4 items-center">
            {#if product.image_url}
              <img
                src={product.image_url}
                alt={product.name}
                class="size-12 rounded object-cover"
              />
            {:else}
              <div class="size-12 rounded bg-neutral-800"></div>
            {/if}
            <div>
              <a
                class="font-medium text-neutral-100"
                href="/admin/products/{product.id}"
              >
                {product.name}
              </a>
              <p class="text-xs text-neutral-400">
                {product.variant_count} variant{product.variant_count === 1 ? "" : "s"}
                ・ in {product.showcase_count} showcase{product.showcase_count === 1
                  ? ""
                  : "s"}
              </p>
            </div>
          </div>
          <a class="btn neutral sm" href="/admin/products/{product.id}">Edit</a>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<section>
  <h2 class="h4 mb-3 text-neutral-100">Create new product</h2>
  {#if form?.error}
    <p class="helper-text error mb-3">{form.error}</p>
  {/if}
  <form
    method="POST"
    action="?/create"
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
    <button class="btn primary md">Create product</button>
  </form>
</section>
