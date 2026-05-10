<script lang="ts">
  import { enhance } from "$app/forms";
  import { cart } from "$lib/cart.svelte";
  import { variantLabel } from "$lib/utils";
  import type { PageData, ActionData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const variantMap = $derived(new Map(data.variants.map((v) => [v.id, v])));

  const items = $derived(
    cart.items
      .map((ci) => ({ ...ci, variant: variantMap.get(ci.variantId) }))
      .filter((i) => i.variant != null),
  );

  const subtotal = $derived(
    items.reduce((s, i) => s + i.qty * i.variant!.price, 0),
  );

  const hasPOD = $derived(
    items.some((i) => i.variant!.product_type === "pod"),
  );
</script>

<section class="from-primary-700 via-primary-800 to-primary-900 bg-linear-to-br pt-32 pb-12">
  <div class="mx-auto max-w-5xl px-4">
    <a class="text-sm text-neutral-300 hover:text-neutral-100" href="/shop">← Shop</a>
    <h1 class="h1 mt-2 font-bold text-neutral-100">Your basket</h1>
  </div>
</section>

<section class="bg-primary-900 py-12">
  <div class="mx-auto max-w-3xl px-4">
    {#if form?.error}
      <p class="helper-text error mb-4">{form.error}</p>
    {/if}

    {#if items.length === 0}
      <p class="p text-neutral-400">
        Your basket is empty.
        <a class="text-secondary-400 hover:text-secondary-200" href="/shop">
          Continue shopping →
        </a>
      </p>
    {:else}
      <form
        method="POST"
        action="?/checkout"
        use:enhance={() => async ({ result, update }) => {
          if (result.type === "redirect") cart.clear();
          await update();
        }}
        class="c-6"
      >
        {#each cart.items as item}
          <input type="hidden" name="qty_{item.variantId}" value={item.qty} />
        {/each}

        <ul class="bg-primary-950/40 border-primary-800/60 c-2 divide-y divide-primary-800/60 overflow-hidden rounded-lg border">
          {#each items as item (item.variantId)}
            {@const v = item.variant!}
            <li class="r-4 items-center p-3">
              {#if v.image_url}
                <img
                  src={v.image_url}
                  alt={v.product_name}
                  class="size-16 rounded object-cover"
                />
              {:else}
                <div class="size-16 rounded bg-primary-900"></div>
              {/if}
              <div class="flex-1">
                <p class="font-medium text-neutral-100">{v.product_name}</p>
                <p class="text-sm text-neutral-400">
                  {variantLabel(v.options)} ・ £{v.price.toFixed(2)}
                  {#if v.product_type === "drop" && v.drop_name}
                    ・ {v.drop_name}
                  {:else if v.product_type === "pod"}
                    ・ ships direct
                  {/if}
                </p>
              </div>
              <input
                class="default w-16 text-center"
                type="number"
                min="1"
                max={v.stock_count ?? undefined}
                value={item.qty}
                oninput={(e) =>
                  cart.setQty(
                    item.variantId,
                    Number((e.currentTarget as HTMLInputElement).value),
                  )}
              />
              <span class="w-20 text-right font-medium text-neutral-100">
                £{(item.qty * v.price).toFixed(2)}
              </span>
              <button
                type="button"
                class="btn neutral sm text-error-400"
                aria-label="Remove"
                onclick={() => cart.remove(item.variantId)}>×</button
              >
            </li>
          {/each}
        </ul>

        <div class="r-4 items-center justify-end text-lg font-bold text-neutral-100">
          Total: £{subtotal.toFixed(2)}
        </div>

        {#if hasPOD}
          <fieldset class="c-4 bg-primary-950/40 border-primary-800/60 rounded-lg border p-6">
            <legend class="px-2 text-sm text-neutral-300">
              Shipping address (for direct-ship items)
            </legend>
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
              <input
                class="default"
                type="text"
                name="country"
                value="United Kingdom"
                required
              />
            </label>
          </fieldset>
        {/if}

        <button class="btn primary lg self-end">Checkout</button>
      </form>
    {/if}
  </div>
</section>
