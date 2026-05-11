<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import { STATUSES } from "./statuses";
  import { variantLabel } from "$lib/utils";
  import { toastSubmit } from "$lib/enhanceWithToast";

  let { data }: { data: PageData } = $props();

  const itemsByOrder = $derived(Object.groupBy(data.items, (i) => i.order_id));
</script>

<div class="r-4 mb-6 items-center justify-between">
  <h1 class="h2 text-neutral-100">Orders</h1>
  <a class="text-sm text-secondary-400 hover:text-secondary-200" href="/admin/orders/variants">
    By variant →
  </a>
</div>

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

<div class="overflow-x-auto">
<table class="w-full min-w-[800px] text-left text-sm">
  <thead class="border-b border-neutral-800 text-neutral-400">
    <tr>
      <th class="py-2 pr-3">Reference</th>
      <th class="py-2 pr-3">User</th>
      <th class="py-2 pr-3">Showcase</th>
      <th class="py-2 pr-3">Items</th>
      <th class="py-2 pr-3">Total</th>
      <th class="py-2 pr-3">Created</th>
      <th class="py-2 pr-3">Status</th>
    </tr>
  </thead>
  <tbody>
    {#each data.orders as o}
      <tr class="align-top odd:bg-neutral-900/40">
        <td class="py-2 pr-3 font-mono align-top">
          <a href="/shop/orders/{o.reference}">{o.reference}</a>
        </td>
        <td class="py-2 pr-3 align-top text-neutral-300">{o.user_email}</td>
        <td class="py-2 pr-3 align-top text-neutral-300">
          <a
            class="hover:text-neutral-100"
            href="/admin/showcases/{o.showcase_id}"
          >
            {o.showcase_name}
          </a>
        </td>
        <td class="py-2 pr-3 align-top text-neutral-300">
          <ul>
            {#each itemsByOrder[o.id] ?? [] as it}
              <li>
                {it.product_name}
                <span class="text-neutral-500"
                  >({variantLabel(it.options)})</span
                >
                × {it.qty}
              </li>
            {/each}
          </ul>
        </td>
        <td class="py-2 pr-3 align-top text-neutral-300">
          £{o.total.toFixed(2)}
        </td>
        <td class="py-2 pr-3 align-top text-neutral-400">
          {new Date(o.created_at).toLocaleDateString("en-GB")}
        </td>
        <td class="py-2 pr-3 align-top">
          <form
            method="POST"
            action="?/setStatus"
            use:enhance={toastSubmit({ success: `${o.reference} updated` })}
          >
            <input type="hidden" name="order_id" value={o.id} />
            <select
              class="default"
              name="status"
              value={o.status}
              onchange={(e) =>
                (e.currentTarget as HTMLSelectElement).form?.requestSubmit()}
            >
              {#each STATUSES as s}
                <option value={s}>{s}</option>
              {/each}
            </select>
          </form>
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
</div>
