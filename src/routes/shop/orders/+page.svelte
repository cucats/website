<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<section class="bg-neutral-950 pt-32 pb-12">
  <div class="mx-auto max-w-4xl px-4">
    <a class="text-sm text-neutral-300 hover:text-neutral-100" href="/shop">← Shop</a>
    <h1 class="h2 mt-2 mb-6 text-neutral-100">Your orders</h1>

    {#if data.orders.length === 0}
      <p class="p text-neutral-400">No orders yet.</p>
    {:else}
      <ul class="c-2 divide-y divide-neutral-800">
        {#each data.orders as o}
          <li class="r-4 items-center justify-between py-3">
            <div>
              <a
                class="font-medium text-neutral-100"
                href="/shop/orders/{o.reference}"
              >
                {o.reference}
              </a>
              <p class="text-sm text-neutral-400">
                {o.type.toUpperCase()} ・ £{(o.total_pence / 100).toFixed(2)} ・
                {new Date(o.created_at).toLocaleString("en-GB")}
              </p>
            </div>
            <span class="text-sm text-neutral-300">{o.status}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>
