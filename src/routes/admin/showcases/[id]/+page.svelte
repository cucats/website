<script lang="ts">
  import { untrack } from "svelte";
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { fade } from "svelte/transition";
  import type { PageData, ActionData } from "./$types";
  import { toastSubmit } from "$lib/enhanceWithToast";
  import { toasts } from "$lib/toasts.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  function toLocalInput(d: Date | string | null): string {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  let order = $state<number[]>(untrack(() => data.products.map((p) => p.id)));
  $effect(() => {
    if (dragId !== null) return;
    order = data.products.map((p) => p.id);
  });
  const productById = $derived(
    new Map(data.products.map((p) => [p.id, p] as const)),
  );
  const ordered = $derived(
    order
      .map((id) => productById.get(id))
      .filter((p): p is (typeof data.products)[number] => p != null),
  );

  let dragId = $state<number | null>(null);
  let dragOverId = $state<number | null>(null);

  function onDragStart(e: DragEvent, id: number) {
    dragId = id;
    e.dataTransfer?.setData("text/plain", String(id));
    if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
  }
  function onDragOver(e: DragEvent, id: number) {
    if (dragId == null || dragId === id) return;
    e.preventDefault();
    dragOverId = id;
    dropAtEnd = false;
  }
  function onDragEnd() {
    dragId = null;
    dragOverId = null;
  }
  let dropAtEnd = $state(false);

  function onContainerOver(e: DragEvent) {
    if (dragId == null) return;
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    dragOverId = null;
    dropAtEnd = true;
  }

  async function onDrop(e: DragEvent) {
    e.preventDefault();
    if (dragId == null) return;
    const moving = dragId;
    const overId = dragOverId;
    const atEnd = dropAtEnd;
    dragId = null;
    dragOverId = null;
    dropAtEnd = false;
    const next = order.filter((x) => x !== moving);
    if (atEnd || overId == null) {
      next.push(moving);
    } else if (overId === moving) {
      return;
    } else {
      const overIdx = next.indexOf(overId);
      if (overIdx < 0) return;
      next.splice(overIdx, 0, moving);
    }
    order = next;
    const body = new FormData();
    body.set("ids", order.join(","));
    const res = await fetch("?/reorderProducts", { method: "POST", body });
    if (res.ok) toasts.show("Order saved");
    else toasts.show("Could not save order", "error");
    await invalidateAll();
  }

  let pickerOpen = $state(false);
</script>

<a class="text-sm text-neutral-400 hover:text-neutral-100" href="/admin/showcases">
  ← Showcases
</a>
<h1 class="h2 mt-2 mb-6 text-neutral-100">{data.showcase.name}</h1>

{#if form?.error}
  <p class="helper-text error mb-4">{form.error}</p>
{/if}

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">
    {data.showcase.kind === "drop" ? "Drop" : "Always-on"} details
  </h2>
  <form
    method="POST"
    action="?/update"
    class="c-4 max-w-lg"
    use:enhance={toastSubmit({ success: "Showcase saved" })}
  >
    <label>
      Slug
      <input class="default" type="text" value={data.showcase.slug} disabled />
    </label>
    <label>
      Name
      <input class="default" type="text" name="name" value={data.showcase.name} required />
    </label>
    <label>
      Description
      <textarea class="default min-h-24" name="description" rows="3"
        >{data.showcase.description ?? ""}</textarea>
    </label>
    {#if data.showcase.kind === "drop"}
      <label>
        Opens at
        <input
          class="default"
          type="datetime-local"
          name="opens_at"
          value={toLocalInput(data.showcase.opens_at)}
          required
        />
      </label>
      <label>
        Closes at
        <input
          class="default"
          type="datetime-local"
          name="closes_at"
          value={toLocalInput(data.showcase.closes_at)}
          required
        />
      </label>
      <label>
        Collection event
        <input
          class="default"
          type="text"
          name="collection_event"
          value={data.showcase.collection_event ?? ""}
        />
      </label>
    {/if}
    <label>
      Status
      <select class="default" name="status" value={data.showcase.status}>
        <option value="draft">draft</option>
        <option value="open">open</option>
        <option value="closed">closed</option>
        <option value="fulfilled">fulfilled</option>
        <option value="cancelled">cancelled</option>
      </select>
    </label>
    <button class="btn primary md self-start">Save</button>
  </form>

  <div class="r-4 mt-4">
    {#if data.showcase.kind === "drop"}
      <a class="btn neutral sm" href="/admin/showcases/{data.showcase.id}/export.csv">
        Download supplier CSV
      </a>
      <form
        method="POST"
        action="?/destroy"
        use:enhance={toastSubmit({ success: "Deleted" })}
      >
        <button
          class="btn neutral sm text-error-400"
          onclick={(e) => {
            if (!confirm("Delete this showcase?")) e.preventDefault();
          }}
        >
          Delete showcase
        </button>
      </form>
    {/if}
  </div>
</section>

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Products in this showcase</h2>

  <div
    class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    role="presentation"
    ondragover={onContainerOver}
    ondrop={onDrop}
  >
    {#each ordered as p (p.id)}
      {#if dragOverId === p.id && dragId !== null && dragId !== p.id}
        <div
          role="presentation"
          class="bg-primary-500/10 border-primary-400 aspect-square rounded-lg border-2 border-dashed"
          ondragover={(e) => e.preventDefault()}
          ondrop={onDrop}
        ></div>
      {/if}
      <article
        class="group bg-primary-950/40 border-primary-800/60 relative cursor-grab overflow-hidden rounded-lg border select-none"
        class:!opacity-30={dragId === p.id}
        draggable="true"
        ondragstart={(e) => onDragStart(e, p.id)}
        ondragover={(e) => onDragOver(e, p.id)}
        ondrop={onDrop}
        ondragend={onDragEnd}
      >
        <div class="bg-primary-900 aspect-square">
          {#if p.image_url}
            <img
              src={p.image_url}
              alt={p.name}
              class="h-full w-full object-cover"
              draggable="false"
            />
          {/if}
        </div>
        <div class="p-3">
          <a
            class="block truncate text-sm font-semibold text-neutral-100 hover:text-neutral-300"
            href="/admin/products/{p.id}"
            ondragstart={(e) => e.preventDefault()}
          >
            {p.name}
          </a>
          <p class="mt-0.5 text-xs text-neutral-400">£{p.price.toFixed(2)}</p>
        </div>
        <form
          method="POST"
          action="?/removeProduct"
          class="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
          use:enhance={toastSubmit({ success: "Removed" })}
        >
          <input type="hidden" name="product_id" value={p.id} />
          <button
            type="submit"
            class="bg-error-600 hover:bg-error-400 flex size-6 cursor-pointer items-center justify-center rounded-full text-base font-bold text-neutral-100 shadow-md"
            aria-label="Remove from showcase"
            draggable="false"
            onmousedown={(e) => e.stopPropagation()}
            ondragstart={(e) => e.preventDefault()}
          >
            ×
          </button>
        </form>
      </article>
    {/each}

    {#if dropAtEnd && dragId !== null}
      <div
        role="presentation"
        class="bg-primary-500/10 border-primary-400 aspect-square rounded-lg border-2 border-dashed"
        ondragover={(e) => e.preventDefault()}
        ondrop={onDrop}
      ></div>
    {/if}

    <button
      type="button"
      onclick={() => (pickerOpen = true)}
      class="group bg-primary-950/20 hover:bg-primary-950/40 border-primary-800/60 hover:border-primary-600 flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all"
      aria-label="Add product"
    >
      <span class="text-5xl text-neutral-500 group-hover:text-neutral-300">+</span>
      <span class="text-sm text-neutral-400 group-hover:text-neutral-200">
        Add product
      </span>
    </button>
  </div>
</section>

{#if pickerOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
    transition:fade={{ duration: 150 }}
    role="dialog"
    aria-modal="true"
    aria-label="Pick a product"
    onclick={(e) => {
      if (e.target === e.currentTarget) pickerOpen = false;
    }}
    onkeydown={(e) => e.key === "Escape" && (pickerOpen = false)}
    tabindex="-1"
  >
    <div
      class="bg-primary-950 border-primary-800/60 max-h-[85vh] w-full max-w-6xl overflow-y-auto rounded-lg border p-6 shadow-2xl"
    >
      <div class="r-4 mb-4 items-center justify-between">
        <h3 class="h4 text-neutral-100">Add product</h3>
        <button
          class="cursor-pointer text-2xl text-neutral-400 hover:text-neutral-100"
          onclick={() => (pickerOpen = false)}
          aria-label="Close">×</button
        >
      </div>
      {#if data.available.length === 0}
        <p class="p text-neutral-400">
          All products are already in this showcase. <a
            class="text-secondary-400 hover:text-secondary-200"
            href="/admin/products/new">Create a new one</a
          >.
        </p>
      {:else}
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {#each data.available as p}
            <form
              method="POST"
              action="?/addProduct"
              use:enhance={() => async ({ result, update }) => {
                if (result.type === "success") {
                  toasts.show(`${p.name} added`);
                  pickerOpen = false;
                } else if (result.type === "failure") {
                  toasts.show("Could not add", "error");
                }
                await update();
              }}
            >
              <input type="hidden" name="product_id" value={p.id} />
              <button
                type="submit"
                class="group bg-primary-900/40 border-primary-800/60 hover:border-primary-400 block w-full cursor-pointer overflow-hidden rounded-lg border text-left transition-all"
              >
                <div class="bg-primary-900 aspect-square">
                  {#if p.image_url}
                    <img
                      src={p.image_url}
                      alt={p.name}
                      class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  {/if}
                </div>
                <div class="p-2">
                  <div class="truncate text-sm font-medium text-neutral-100">
                    {p.name}
                  </div>
                  <div class="text-xs text-neutral-400">£{p.price.toFixed(2)}</div>
                </div>
              </button>
            </form>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}
