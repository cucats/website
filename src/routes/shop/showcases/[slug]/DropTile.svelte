<script lang="ts">
  import { untrack } from "svelte";
  import { cart } from "$lib/cart.svelte";
  import { variantLabel } from "$lib/utils";

  interface Variant {
    id: number;
    options: Record<string, string>;
    stock_count: number | null;
  }

  interface Props {
    name: string;
    image_url: string | null;
    description: string | null;
    price: number;
    variants: Variant[];
    isOpen: boolean;
  }

  let {
    name,
    image_url,
    description,
    price,
    variants,
    isOpen,
  }: Props = $props();

  let selectedId = $state<number | null>(untrack(() => variants[0]?.id ?? null));
  let qty = $state(1);
  let added = $state(false);

  const selected = $derived(variants.find((v) => v.id === selectedId));

  function addToCart() {
    if (selectedId == null) return;
    cart.add(selectedId, qty);
    added = true;
    setTimeout(() => (added = false), 1200);
  }
</script>

<article
  class="bg-primary-950/40 border-primary-800/60 flex flex-col overflow-hidden rounded-lg border"
>
  <div class="bg-primary-900 aspect-square">
    {#if image_url}
      <img src={image_url} alt={name} class="h-full w-full object-cover" />
    {/if}
  </div>
  <div class="c-3 flex-1 p-4">
    <div class="r-2 items-baseline justify-between">
      <h2 class="h4 text-neutral-100">{name}</h2>
      <span class="text-sm font-semibold text-neutral-200">£{price.toFixed(2)}</span>
    </div>
    {#if description}
      <p class="text-sm text-neutral-400">{description}</p>
    {/if}
    <div class="c-2 mt-auto">
      <select class="default" bind:value={selectedId} disabled={!isOpen}>
        {#each variants as v}
          <option value={v.id} disabled={v.stock_count === 0}>
            {variantLabel(v.options)}
            {#if v.stock_count != null}
              ・ {v.stock_count} left
            {/if}
          </option>
        {/each}
      </select>
      <div class="r-2">
        <input
          class="default w-16 text-center"
          type="number"
          min="1"
          max={selected?.stock_count ?? undefined}
          bind:value={qty}
          disabled={!isOpen}
        />
        <button
          type="button"
          class="btn primary sm flex-1 cursor-pointer"
          onclick={addToCart}
          disabled={!isOpen || selectedId == null}
        >
          {added ? "Added" : "Add to basket"}
        </button>
      </div>
    </div>
  </div>
</article>
