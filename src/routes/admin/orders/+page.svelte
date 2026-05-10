<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const STATUSES = [
    "pending",
    "paid",
    "ready",
    "shipped",
    "collected",
    "delivered",
    "cancelled",
  ];
</script>

<h1 class="h2 mb-6 text-neutral-100">Orders</h1>

<form class="r-4 mb-6 items-end">
  <label>
    Status
    <select class="default" name="status" value={data.filters.status ?? ""}>
      <option value="">any</option>
      {#each STATUSES as s}
        <option value={s}>{s}</option>
      {/each}
    </select>
  </label>
  <label>
    Type
    <select class="default" name="type" value={data.filters.type ?? ""}>
      <option value="">any</option>
      <option value="drop">drop</option>
      <option value="pod">pod</option>
    </select>
  </label>
  <button class="btn neutral sm">Filter</button>
</form>

<table class="w-full text-left text-sm">
  <thead class="border-b border-neutral-800 text-neutral-400">
    <tr>
      <th class="py-2 pr-3">Reference</th>
      <th class="py-2 pr-3">User</th>
      <th class="py-2 pr-3">Type</th>
      <th class="py-2 pr-3">Status</th>
      <th class="py-2 pr-3">Total</th>
      <th class="py-2 pr-3">Created</th>
      <th class="py-2 pr-3">Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each data.orders as o}
      <tr class="align-top odd:bg-neutral-900/40">
        <td class="py-2 pr-3 font-mono">
          <a href="/shop/orders/{o.reference}">{o.reference}</a>
        </td>
        <td class="py-2 pr-3 text-neutral-300">{o.user_email}</td>
        <td class="py-2 pr-3 text-neutral-300">{o.type}</td>
        <td class="py-2 pr-3 text-neutral-200">{o.status}</td>
        <td class="py-2 pr-3 text-neutral-300">
          £{o.total.toFixed(2)}
        </td>
        <td class="py-2 pr-3 text-neutral-400">
          {new Date(o.created_at).toLocaleDateString("en-GB")}
        </td>
        <td class="py-2 pr-3">
          <div class="r-2 flex-wrap">
            {#if o.status === "pending"}
              <form method="POST" action="?/markPaid">
                <input type="hidden" name="order_id" value={o.id} />
                <button class="btn neutral sm">Paid</button>
              </form>
            {/if}
            {#if o.status === "paid" && o.type === "drop"}
              <form method="POST" action="?/markReady">
                <input type="hidden" name="order_id" value={o.id} />
                <button class="btn neutral sm">Ready</button>
              </form>
            {/if}
            {#if o.status === "paid" && o.type === "pod"}
              <form method="POST" action="?/markShipped">
                <input type="hidden" name="order_id" value={o.id} />
                <button class="btn neutral sm">Shipped</button>
              </form>
            {/if}
            {#if o.status === "ready"}
              <form method="POST" action="?/markCollected">
                <input type="hidden" name="order_id" value={o.id} />
                <button class="btn neutral sm">Collected</button>
              </form>
            {/if}
            {#if o.status === "shipped"}
              <form method="POST" action="?/markDelivered">
                <input type="hidden" name="order_id" value={o.id} />
                <button class="btn neutral sm">Delivered</button>
              </form>
            {/if}
            {#if o.status !== "cancelled" && o.status !== "collected" && o.status !== "delivered"}
              <form method="POST" action="?/cancel">
                <input type="hidden" name="order_id" value={o.id} />
                <button
                  class="btn neutral sm text-error-400"
                  onclick={(e) => {
                    if (!confirm(`Cancel order ${o.reference}?`)) e.preventDefault();
                  }}>Cancel</button
                >
              </form>
            {/if}
            {#if o.status === "cancelled"}
              <form method="POST" action="?/restore">
                <input type="hidden" name="order_id" value={o.id} />
                <button class="btn neutral sm">Restore</button>
              </form>
            {/if}
          </div>
        </td>
      </tr>
    {:else}
      <tr>
        <td colspan="7" class="py-6 text-center text-neutral-500">
          No orders match.
        </td>
      </tr>
    {/each}
  </tbody>
</table>
