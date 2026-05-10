<script lang="ts">
  import type { PageData, ActionData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<h1 class="h2 mb-6 text-neutral-100">Order-anytime products</h1>

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Existing</h2>
  {#if data.products.length === 0}
    <p class="p text-neutral-400">No POD products yet.</p>
  {:else}
    <ul class="c-2 divide-y divide-neutral-800">
      {#each data.products as product, i}
        <li class="r-4 items-center justify-between py-3">
          <div class="r-4 items-center">
            {#if product.image_url}
              <img
                src={product.image_url}
                alt={product.name}
                class="size-12 rounded object-cover"
              />
            {/if}
            <a class="font-medium text-neutral-100" href="/admin/pod/{product.id}">
              {product.name}
            </a>
          </div>
          <div class="r-2">
            <form method="POST" action="?/moveUp">
              <input type="hidden" name="product_id" value={product.id} />
              <button
                class="btn neutral sm"
                aria-label="Move up"
                disabled={i === 0}>↑</button
              >
            </form>
            <form method="POST" action="?/moveDown">
              <input type="hidden" name="product_id" value={product.id} />
              <button
                class="btn neutral sm"
                aria-label="Move down"
                disabled={i === data.products.length - 1}>↓</button
              >
            </form>
            <a class="btn neutral sm" href="/admin/pod/{product.id}">Edit</a>
          </div>
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
