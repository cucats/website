<script lang="ts">
  import ProductCard from "$lib/components/ProductCard.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  function priceLabel(min: number | null, max: number | null): string | undefined {
    if (min == null) return undefined;
    if (max == null || min === max) return `£${min.toFixed(2)}`;
    return `£${min.toFixed(2)} – £${max.toFixed(2)}`;
  }
</script>

<section class="from-secondary-700 to-tertiary-700 bg-linear-to-br pt-32 pb-12">
  <div class="mx-auto max-w-7xl px-4">
    <a class="text-sm text-neutral-300 hover:text-neutral-100" href="/shop">← Shop</a>
    <h1 class="h1 mt-2 font-bold text-neutral-100">Order anytime</h1>
    <p class="p mt-3 max-w-2xl text-neutral-200">
      Always-available items shipped direct to you. Drops are cheaper because we
      bulk-order; order anytime if you'd rather not wait.
    </p>
  </div>
</section>

<section class="bg-neutral-950 py-12">
  <div class="mx-auto max-w-7xl px-4">
    {#if data.products.length === 0}
      <p class="p text-neutral-400">Nothing here yet.</p>
    {:else}
      <div class="r-4 flex-wrap">
        {#each data.products as p}
          <ProductCard
            name={p.name}
            href={`/shop/pod/${p.id}`}
            image={p.image_url}
            priceLabel={priceLabel(p.min_price, p.max_price)}
          />
        {/each}
      </div>
    {/if}
  </div>
</section>
