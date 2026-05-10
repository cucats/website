<script lang="ts">
  import { page } from "$app/state";
  import { signIn } from "@auth/sveltekit/client";
  import ProductCard from "$lib/components/ProductCard.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const session = $derived(page.data.session);

  function priceLabel(min: number | null, max: number | null): string | undefined {
    if (min == null) return undefined;
    if (max == null || min === max) return `£${min.toFixed(2)}`;
    return `£${min.toFixed(2)} – £${max.toFixed(2)}`;
  }

  function dateRange(opens: Date | string, closes: Date | string): string {
    const o = new Date(opens);
    const c = new Date(closes);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    return `${fmt(o)} – ${fmt(c)}`;
  }
</script>

<section class="from-primary-700 via-secondary-800 to-tertiary-800 bg-linear-to-br pt-32 pb-16">
  <div class="mx-auto max-w-7xl px-4">
    <h1 class="h1 text-neutral-100">Shop</h1>
  </div>
</section>

{#if !session?.user}
  <section class="flex flex-1 items-center justify-center bg-neutral-950 py-16">
    <button class="btn primary md" onclick={() => signIn("keycloak")}>
      Sign in
    </button>
  </section>
{:else}
  <section class="bg-primary-900 py-16">
    <div class="mx-auto max-w-7xl px-4">
      <h2 class="h2 mb-6 text-neutral-100">Current drop</h2>
      {#if data.openDrop}
        {@const d = data.openDrop}
        <div class="r-8 items-start">
          <div>
            <h3 class="h3 mb-2 text-neutral-100">{d.name}</h3>
            <p class="p mb-3 max-w-2xl text-neutral-300">{d.description ?? ""}</p>
            <p class="text-sm text-neutral-400">
              Open {dateRange(d.opens_at, d.closes_at)}
              {#if d.collection_event}
                ・ Collection: {d.collection_event}
              {/if}
            </p>
            <a class="btn primary md mt-4" href="/shop/drops/{d.slug}">View items</a>
          </div>
        </div>
      {:else}
        <p class="p text-neutral-400">
          No drop is open right now. Check back soon, or browse the print-on-demand
          catalogue below.
        </p>
      {/if}
    </div>
  </section>

  <section class="bg-primary-800 py-16">
    <div class="mx-auto max-w-7xl px-4">
      <div class="r-4 mb-6 items-end justify-between">
        <h2 class="h2 text-neutral-100">Print on demand</h2>
        <a class="text-sm text-neutral-300 hover:text-neutral-100" href="/shop/pod">
          See all →
        </a>
      </div>
      {#if data.podProducts.length === 0}
        <p class="p text-neutral-400">Nothing here yet.</p>
      {:else}
        <div class="r-4 flex-wrap">
          {#each data.podProducts.slice(0, 4) as p}
            <ProductCard
              name={p.name}
              href={`/shop/pod#product-${p.id}`}
              description={p.description}
              image={p.image_url}
              priceLabel={priceLabel(p.min_price, p.max_price)}
            />
          {/each}
        </div>
      {/if}
    </div>
  </section>

  {#if data.pastDrops.length > 0}
    <section class="bg-primary-900 py-16">
      <div class="mx-auto max-w-7xl px-4">
        <h2 class="h2 mb-6 text-neutral-100">Past drops</h2>
        <ul class="c-2 divide-y divide-neutral-800">
          {#each data.pastDrops as d}
            <li class="r-4 items-center justify-between py-3">
              <div>
                <p class="font-medium text-neutral-100">{d.name}</p>
                <p class="text-sm text-neutral-400">
                  {dateRange(d.opens_at, d.closes_at)} ・ {d.status}
                </p>
              </div>
              <a class="btn neutral sm" href="/shop/drops/{d.slug}">View</a>
            </li>
          {/each}
        </ul>
      </div>
    </section>
  {/if}
{/if}
