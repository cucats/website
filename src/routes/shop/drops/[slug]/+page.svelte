<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import { variantLabel } from "$lib/utils";

  let { data, form }: { data: PageData; form: ActionData } = $props();

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
    <h1 class="h1 mt-2 text-neutral-100">{data.drop.name}</h1>
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

<section class="bg-neutral-950 py-12">
  <div class="mx-auto max-w-7xl px-4">
    {#if form?.error}
      <p class="helper-text error mb-4">{form.error}</p>
    {/if}

    {#if data.products.length === 0}
      <p class="p text-neutral-400">No products in this drop yet.</p>
    {:else}
      <form method="POST" action="?/order" class="c-8">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {#each data.products as product}
            <article
              class="flex flex-col overflow-hidden rounded-lg border border-neutral-800"
            >
              <div class="bg-primary-900 aspect-square">
                {#if product.image_url}
                  <img
                    src={product.image_url}
                    alt={product.name}
                    class="h-full w-full object-cover"
                  />
                {/if}
              </div>
              <div class="c-3 flex-1 p-4">
                <h2 class="h4 text-neutral-100">{product.name}</h2>
                {#if product.description}
                  <p class="text-sm text-neutral-400">{product.description}</p>
                {/if}
                <ul class="c-2 mt-auto">
                  {#each variantsByProduct[product.id] ?? [] as v}
                    <li>
                      <label class="r-2 items-center justify-between text-sm">
                        <span class="text-neutral-200">
                          {variantLabel(v.options)} ・ £{v.price.toFixed(2)}
                          {#if v.stock_count != null}
                            ・ {v.stock_count} left
                          {/if}
                        </span>
                        <input
                          class="default w-16"
                          type="number"
                          name="qty_{v.id}"
                          min="0"
                          max={v.stock_count ?? undefined}
                          value="0"
                          disabled={!data.isOpen}
                        />
                      </label>
                    </li>
                  {/each}
                </ul>
              </div>
            </article>
          {/each}
        </div>

        {#if data.isOpen}
          <button class="btn primary lg self-start">Place order</button>
        {/if}
      </form>
    {/if}
  </div>
</section>
