<script lang="ts">
  import { untrack } from "svelte";
  import { cart } from "$lib/cart.svelte";
  import { variantLabel } from "$lib/utils";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let selectedId = $state<number | null>(
    untrack(() => data.variants[0]?.id ?? null),
  );
  let qty = $state(1);
  let added = $state(false);

  const selected = $derived(data.variants.find((v) => v.id === selectedId));
  const prices = $derived(data.variants.map((v) => v.price));
  const min = $derived(prices.length ? Math.min(...prices) : 0);
  const max = $derived(prices.length ? Math.max(...prices) : 0);
  const uniform = $derived(min === max);

  function addToCart() {
    if (selectedId == null) return;
    cart.add(selectedId, qty);
    added = true;
    setTimeout(() => (added = false), 1200);
  }
</script>

<section class="from-secondary-700 to-tertiary-700 bg-linear-to-br pt-32 pb-12">
  <div class="mx-auto max-w-5xl px-4">
    <a class="text-sm text-neutral-300 hover:text-neutral-100" href="/shop/pod">
      ← Order anytime
    </a>
    <h1 class="h1 mt-2 font-bold text-neutral-100">{data.product.name}</h1>
    {#if data.product.description}
      <p class="p mt-3 max-w-2xl text-neutral-200">{data.product.description}</p>
    {/if}
  </div>
</section>

<section class="bg-primary-900 py-12">
  <div class="mx-auto max-w-3xl px-4">
    <article
      class="bg-primary-950/40 border-primary-800/60 r-8 items-start rounded-lg border p-6"
    >
      {#if data.product.image_url}
        <img
          src={data.product.image_url}
          alt={data.product.name}
          class="h-56 w-56 rounded object-cover"
        />
      {/if}
      <div class="c-4 flex-1">
        <div class="r-2 items-baseline justify-between">
          <h2 class="h3 text-neutral-100">{data.product.name}</h2>
          <span class="text-lg font-semibold text-neutral-100">
            {#if uniform}
              £{min.toFixed(2)}
            {:else}
              £{min.toFixed(2)} – £{max.toFixed(2)}
            {/if}
          </span>
        </div>

        {#if data.variants.length === 0}
          <p class="p text-neutral-400">No variants available.</p>
        {:else}
          <label>
            Variant
            <select class="default" bind:value={selectedId}>
              {#each data.variants as v}
                <option value={v.id} disabled={v.stock_count === 0}>
                  {variantLabel(v.options)}
                  {#if !uniform}
                    ・ £{v.price.toFixed(2)}
                  {/if}
                  {#if v.stock_count != null}
                    ・ {v.stock_count} left
                  {/if}
                </option>
              {/each}
            </select>
          </label>

          <label>
            Quantity
            <input
              class="default w-24"
              type="number"
              min="1"
              max={selected?.stock_count ?? undefined}
              bind:value={qty}
            />
          </label>

          <button
            type="button"
            class="btn primary md self-start cursor-pointer"
            onclick={addToCart}
            disabled={selectedId == null}
          >
            {added ? "Added" : "Add to basket"}
          </button>
        {/if}
      </div>
    </article>
  </div>
</section>
