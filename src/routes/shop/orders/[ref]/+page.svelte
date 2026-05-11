<script lang="ts">
  import type { PageData } from "./$types";
  import { variantLabel } from "$lib/utils";

  let { data }: { data: PageData } = $props();

  let copied = $state(false);

  async function copyReference() {
    await navigator.clipboard.writeText(data.order.reference);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  }

  function steps(type: "drop" | "pod") {
    return type === "drop"
      ? (["pending", "paid", "ready", "collected"] as const)
      : (["pending", "paid", "shipped", "delivered"] as const);
  }

  const stepsForOrder = $derived(steps(data.order.type));
  const currentIdx = $derived(
    Math.max(stepsForOrder.indexOf(data.order.status as never), 0),
  );
</script>

<section class="bg-neutral-950 pt-32 pb-16">
  <div class="mx-auto max-w-3xl px-4">
    <a class="text-sm text-neutral-300 hover:text-neutral-100" href="/shop/orders">
      ← Your orders
    </a>
    <h1 class="h2 mt-2 mb-2 text-neutral-100">Order {data.order.reference}</h1>
    <p class="p text-neutral-400">
      Placed {new Date(data.order.created_at).toLocaleString("en-GB")}
    </p>

    <ol class="c-2 my-8">
      {#each stepsForOrder as step, i}
        <li class="r-4 items-center text-sm">
          <span
            class="size-3 rounded-full"
            class:bg-primary-500={i <= currentIdx}
            class:bg-neutral-700={i > currentIdx}
          ></span>
          <span
            class="capitalize"
            class:text-neutral-100={i <= currentIdx}
            class:text-neutral-500={i > currentIdx}
          >
            {step}
          </span>
        </li>
      {/each}
      {#if data.order.status === "cancelled"}
        <li class="r-4 items-center text-sm">
          <span class="bg-error-500 size-3 rounded-full"></span>
          <span class="text-error-300">Cancelled</span>
        </li>
      {/if}
    </ol>

    <section class="mb-8 rounded-lg border border-neutral-800 p-6">
      <h2 class="h4 mb-3 text-neutral-100">Items</h2>
      <ul class="c-2">
        {#each data.items as it}
          <li class="r-4 items-center justify-between text-sm">
            <span class="text-neutral-200">
              {it.product_name} ({variantLabel(it.options)}) × {it.qty}
            </span>
            <span class="text-neutral-300">
              £{(it.qty * it.price_at_order).toFixed(2)}
            </span>
          </li>
        {/each}
        <li class="r-4 mt-2 items-center justify-between border-t border-neutral-800 pt-3 text-sm font-bold">
          <span class="text-neutral-100">Total</span>
          <span class="text-neutral-100">
            £{data.order.total.toFixed(2)}
          </span>
        </li>
      </ul>
    </section>

    {#if data.order.status === "pending"}
      <section class="bg-primary-900/30 mb-8 rounded-lg border border-primary-700 p-6">
        <h2 class="h4 mb-3 text-neutral-100">Pay by bank transfer</h2>
        <p class="p mb-4 text-neutral-300">
          We'll mark your order as paid once we receive your transfer. Use the
          reference exactly as shown.
        </p>
        <dl class="c-2 text-sm">
          <div class="r-4 justify-between">
            <dt class="text-neutral-400">Account name</dt>
            <dd class="font-mono text-neutral-100">{data.bank.accountName}</dd>
          </div>
          <div class="r-4 justify-between">
            <dt class="text-neutral-400">Sort code</dt>
            <dd class="font-mono text-neutral-100">{data.bank.sortCode}</dd>
          </div>
          <div class="r-4 justify-between">
            <dt class="text-neutral-400">Account number</dt>
            <dd class="font-mono text-neutral-100">{data.bank.accountNumber}</dd>
          </div>
          <div class="r-4 items-center justify-between">
            <dt class="text-neutral-400">Reference</dt>
            <dd class="r-2 items-center">
              <span class="font-mono text-neutral-100">{data.order.reference}</span>
              <button
                class="btn neutral sm"
                type="button"
                onclick={copyReference}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </dd>
          </div>
        </dl>
      </section>
    {/if}


    {#if data.order.type === "pod" && data.order.shipping_address}
      {@const a = data.order.shipping_address}
      <section class="mb-8 rounded-lg border border-neutral-800 p-6">
        <h2 class="h4 mb-2 text-neutral-100">Shipping to</h2>
        <address class="text-sm text-neutral-300 not-italic">
          {a.recipient}<br />
          {a.line1}<br />
          {#if a.line2}
            {a.line2}<br />
          {/if}
          {a.city}, {a.postcode}<br />
          {a.country}
        </address>
      </section>
    {/if}
  </div>
</section>
