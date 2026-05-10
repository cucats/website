<script lang="ts">
  import DropTile from "./DropTile.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const variantsByProduct = $derived(
    Object.groupBy(data.variants, (v) => v.product_id),
  );

  function dateRange(opens: Date | string, closes: Date | string): string {
    const o = new Date(opens);
    const c = new Date(closes);
    const fmt = (d: Date) =>
      d.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    return `${fmt(o)} – ${fmt(c)}`;
  }
</script>

<section class="from-primary-700 via-primary-800 to-primary-900 bg-linear-to-br pt-32 pb-12">
  <div class="mx-auto max-w-5xl px-4">
    <a class="text-sm text-neutral-300 hover:text-neutral-100" href="/shop">← Shop</a>
    <h1 class="h1 mt-2 font-bold text-neutral-100">{data.drop.name}</h1>
    {#if data.drop.description}
      <p class="p mt-3 max-w-3xl text-neutral-200">{data.drop.description}</p>
    {/if}
    <p class="mt-3 text-sm text-neutral-300">
      {dateRange(data.drop.opens_at, data.drop.closes_at)}
      {#if data.drop.collection_event}
        ・ Collection: {data.drop.collection_event}
      {/if}
    </p>
    {#if !data.isOpen}
      <p class="helper-text mt-3">This drop is not currently open for orders.</p>
    {/if}
  </div>
</section>

<section class="bg-primary-900 py-12">
  <div class="mx-auto max-w-7xl px-4">
    {#if data.products.length === 0}
      <p class="p text-neutral-400">No products in this drop yet.</p>
    {:else}
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each data.products as product}
          <DropTile
            name={product.name}
            image_url={product.image_url}
            description={product.description}
            variants={variantsByProduct[product.id] ?? []}
            isOpen={data.isOpen}
          />
        {/each}
      </div>
    {/if}
  </div>
</section>
