<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<div class="r-4 mb-6 items-center justify-between">
  <h1 class="h2 text-neutral-100">Products</h1>
  <a class="btn primary md" href="/admin/products/new">+ New product</a>
</div>

{#if data.products.length === 0}
  <p class="p text-neutral-400">
    No products yet — <a
      class="text-secondary-400 hover:text-secondary-200"
      href="/admin/products/new">create your first one</a
    >.
  </p>
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
              {product.variant_count} variant{product.variant_count === 1
                ? ""
                : "s"} ・ in {product.showcase_count} showcase{product.showcase_count ===
              1
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
