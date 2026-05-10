<script lang="ts">
  import type { PageData, ActionData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<section class="from-secondary-700 to-tertiary-700 bg-linear-to-br pt-32 pb-12">
  <div class="mx-auto max-w-5xl px-4">
    <a class="text-sm text-neutral-300 hover:text-neutral-100" href="/shop/pod">
      ← Print on demand
    </a>
    <h1 class="h1 mt-2 text-neutral-100">{data.product.name}</h1>
    {#if data.product.description}
      <p class="p mt-3 max-w-2xl text-neutral-200">{data.product.description}</p>
    {/if}
  </div>
</section>

<section class="bg-neutral-950 py-12">
  <div class="mx-auto max-w-5xl px-4">
    {#if form?.error}
      <p class="helper-text error mb-4">{form.error}</p>
    {/if}

    <form method="POST" action="?/order" class="c-8">
      <article class="r-8 items-start rounded-lg border border-neutral-800 p-6">
        {#if data.product.image_url}
          <img
            src={data.product.image_url}
            alt={data.product.name}
            class="h-40 w-40 rounded object-cover"
          />
        {/if}
        <div class="flex-1">
          <h2 class="h4 mb-3 text-neutral-100">Variants</h2>
          {#if data.variants.length === 0}
            <p class="p text-neutral-400">No variants available.</p>
          {:else}
            <div class="c-2">
              {#each data.variants as v}
                <label class="r-4 items-center justify-between text-sm">
                  <span class="text-neutral-200">
                    {v.label} ・ £{(v.price_pence / 100).toFixed(2)}
                    {#if v.stock_count != null}
                      ・ {v.stock_count} left
                    {/if}
                  </span>
                  <input
                    class="default w-24"
                    type="number"
                    name="qty_{v.id}"
                    min="0"
                    max={v.stock_count ?? undefined}
                    value="0"
                  />
                </label>
              {/each}
            </div>
          {/if}
        </div>
      </article>

      <fieldset class="c-4 rounded-lg border border-neutral-800 p-6">
        <legend class="px-2 text-sm text-neutral-300">Shipping address</legend>
        <label>
          Recipient name
          <input class="default" type="text" name="recipient" required />
        </label>
        <label>
          Address line 1
          <input class="default" type="text" name="line1" required />
        </label>
        <label>
          Address line 2
          <input class="default" type="text" name="line2" />
        </label>
        <div class="r-4">
          <label class="flex-1">
            City
            <input class="default" type="text" name="city" required />
          </label>
          <label class="flex-1">
            Postcode
            <input class="default" type="text" name="postcode" required />
          </label>
        </div>
        <label>
          Country
          <input class="default" type="text" name="country" value="United Kingdom" required />
        </label>
      </fieldset>

      <button class="btn primary lg self-start">Place order</button>
    </form>
  </div>
</section>
