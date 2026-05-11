<script lang="ts">
  import type { PageData } from "./$types";
  import { variantLabel } from "$lib/utils";

  let { data }: { data: PageData } = $props();

  function active(r: PageData["rows"][number]): number {
    return r.pending_qty + r.paid_qty + r.ready_qty + r.shipped_qty + r.collected_qty + r.delivered_qty;
  }
</script>

<div class="r-4 mb-6 items-center justify-between">
  <h1 class="h2 text-neutral-100">Orders — by variant</h1>
  <a class="text-sm text-secondary-400 hover:text-secondary-200" href="/admin/orders">
    ← By order
  </a>
</div>

<p class="p mb-6 max-w-2xl text-neutral-400">
  Aggregate quantities ordered per product variant. Useful for filling out the
  supplier order form. Cancelled orders are shown separately.
</p>

<form class="r-4 mb-6 items-end">
  <label>
    Showcase
    <select class="default" name="showcase" value={data.filters.showcaseId ?? ""}>
      <option value="">any</option>
      {#each data.showcases as s}
        <option value={s.id}>{s.name}</option>
      {/each}
    </select>
  </label>
  <button class="btn neutral sm">Filter</button>
</form>

<table class="w-full text-left text-sm">
  <thead class="border-b border-neutral-800 text-neutral-400">
    <tr>
      <th class="py-2 pr-3">Product</th>
      <th class="py-2 pr-3">Variant</th>
      <th class="py-2 pr-3 text-right">Pending</th>
      <th class="py-2 pr-3 text-right">Paid</th>
      <th class="py-2 pr-3 text-right">Ready / shipped</th>
      <th class="py-2 pr-3 text-right">Collected / delivered</th>
      <th class="py-2 pr-3 text-right">Active total</th>
      <th class="py-2 pr-3 text-right">Cancelled</th>
    </tr>
  </thead>
  <tbody>
    {#each data.rows as r}
      <tr class="align-top odd:bg-neutral-900/40">
        <td class="py-2 pr-3">
          <a
            class="text-neutral-100 hover:text-neutral-300"
            href="/admin/products/{r.product_id}"
          >
            {r.product_name}
          </a>
        </td>
        <td class="py-2 pr-3 text-neutral-300">{variantLabel(r.options)}</td>
        <td class="py-2 pr-3 text-right text-neutral-300">{r.pending_qty}</td>
        <td class="py-2 pr-3 text-right text-neutral-300">{r.paid_qty}</td>
        <td class="py-2 pr-3 text-right text-neutral-300">
          {r.ready_qty + r.shipped_qty}
        </td>
        <td class="py-2 pr-3 text-right text-neutral-300">
          {r.collected_qty + r.delivered_qty}
        </td>
        <td class="py-2 pr-3 text-right font-semibold text-neutral-100">
          {active(r)}
        </td>
        <td class="py-2 pr-3 text-right text-neutral-500">{r.cancelled_qty}</td>
      </tr>
    {:else}
      <tr>
        <td colspan="8" class="py-6 text-center text-neutral-500">
          No orders match.
        </td>
      </tr>
    {/each}
  </tbody>
</table>
