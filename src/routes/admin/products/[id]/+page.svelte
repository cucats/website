<script lang="ts">
  import { untrack } from "svelte";
  import { enhance } from "$app/forms";
  import { beforeNavigate } from "$app/navigation";
  import type { PageData, ActionData } from "./$types";
  import { variantLabel } from "$lib/utils";
  import { toastSubmit } from "$lib/enhanceWithToast";
  import { toasts } from "$lib/toasts.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const axisName = $derived(data.product.axis_name);

  // Local drag-reorder state. The server only learns about the new order
  // when the admin clicks Save.
  let order = $state<number[]>(untrack(() => data.variants.map((v) => v.id)));
  let savedSnapshot = $state<number[]>(untrack(() => data.variants.map((v) => v.id)));
  const orderDirty = $derived(order.join(",") !== savedSnapshot.join(","));

  $effect(() => {
    if (dragId !== null || orderDirty) return;
    const fresh = data.variants.map((v) => v.id);
    order = fresh;
    savedSnapshot = fresh;
  });

  $effect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (orderDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  });

  beforeNavigate(({ cancel }) => {
    if (
      orderDirty &&
      !confirm("You have unsaved variant order changes. Leave anyway?")
    ) {
      cancel();
    }
  });

  const variantById = $derived(
    new Map(data.variants.map((v) => [v.id, v] as const)),
  );
  const orderedVariants = $derived(
    order
      .map((id) => variantById.get(id))
      .filter((v): v is (typeof data.variants)[number] => v != null),
  );

  let dragId = $state<number | null>(null);
  let dragOverId = $state<number | null>(null);
  let dropAtEnd = $state(false);
  let clickOffsetX = 0;
  let clickOffsetY = 0;
  let dragWidth = 0;
  let dragHeight = 0;

  function onDragStart(e: DragEvent, id: number) {
    dragId = id;
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    clickOffsetX = e.clientX - r.left;
    clickOffsetY = e.clientY - r.top;
    dragWidth = r.width;
    dragHeight = r.height;
    e.dataTransfer?.setData("text/plain", String(id));
    if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
  }
  function onContainerOver(e: DragEvent) {
    if (dragId == null) return;
    e.preventDefault();
    const centerX = e.clientX - clickOffsetX + dragWidth / 2;
    const centerY = e.clientY - clickOffsetY + dragHeight / 2;
    const container = e.currentTarget as HTMLElement;
    const tiles = container.querySelectorAll<HTMLElement>("[data-tile-id]");
    let found: number | null = null;
    for (const t of tiles) {
      const tid = Number(t.dataset.tileId);
      if (tid === dragId) continue;
      const r = t.getBoundingClientRect();
      if (
        centerX >= r.left &&
        centerX <= r.right &&
        centerY >= r.top &&
        centerY <= r.bottom
      ) {
        found = tid;
        break;
      }
    }
    if (found !== null) {
      dragOverId = found;
      dropAtEnd = false;
    } else {
      dragOverId = null;
      dropAtEnd = true;
    }
  }
  function onDragEnd() {
    dragId = null;
    dragOverId = null;
    dropAtEnd = false;
  }
  function onDrop(e: DragEvent) {
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
  }

  async function saveOrder() {
    const body = new FormData();
    body.set("ids", order.join(","));
    const res = await fetch("?/reorderVariants", { method: "POST", body });
    if (res.ok) {
      toasts.show("Order saved");
      savedSnapshot = [...order];
    } else {
      toasts.show("Could not save order", "error");
    }
  }
  function discardOrder() {
    order = [...savedSnapshot];
  }
</script>

<a class="text-sm text-neutral-400 hover:text-neutral-100" href="/admin/products">
  ← Products
</a>
<h1 class="h2 mt-2 mb-6 text-neutral-100">{data.product.name}</h1>

{#if form?.error}
  <p class="helper-text error mb-4">{form.error}</p>
{/if}

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Details</h2>
  <form
    method="POST"
    action="?/update"
    enctype="multipart/form-data"
    autocomplete="off"
    class="c-4 max-w-xl"
    use:enhance={toastSubmit({ success: "Product saved" })}
  >
    <label for="product-title">
      Title
      <input
        id="product-title"
        class="default"
        type="text"
        name="title"
        autocomplete="off"
        data-form-type="other"
        data-lpignore="true"
        value={data.product.name}
        required
      />
    </label>
    <label for="product-price">
      Price (£)
      <input
        id="product-price"
        class="default max-w-xs"
        type="number"
        name="price"
        min="0"
        step="0.01"
        value={data.product.price}
        required
      />
    </label>
    <label for="product-axis">
      Variant axis (e.g. size, colour) — leave blank if not varied
      <input
        id="product-axis"
        class="default max-w-xs"
        type="text"
        name="axis_name"
        autocomplete="off"
        data-lpignore="true"
        value={data.product.axis_name ?? ""}
        placeholder="size"
      />
    </label>
    <label for="product-description">
      Description
      <textarea
        id="product-description"
        class="default min-h-20"
        name="description"
        autocomplete="off"
        data-form-type="other"
        data-lpignore="true"
        rows="3">{data.product.description ?? ""}</textarea>
    </label>
    <div class="r-4 items-end">
      {#if data.product.image_url}
        <img
          src={data.product.image_url}
          alt={data.product.name}
          class="size-20 rounded object-cover"
        />
      {/if}
      <label class="flex-1">
        {data.product.image_url ? "Replace image" : "Image"}
        <input
          class="default"
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        />
      </label>
    </div>
    <button class="btn primary md self-start">Save</button>
  </form>
  <form
    method="POST"
    action="?/destroy"
    class="mt-4"
    use:enhance={toastSubmit({ success: "Deleted" })}
  >
    <button
      class="btn neutral sm text-error-400"
      onclick={(e) => {
        if (!confirm("Delete this product? It will be removed from any showcase."))
          e.preventDefault();
      }}
    >
      Delete product
    </button>
  </form>
</section>

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Showcases</h2>
  {#if data.showcases.length === 0}
    <p class="p mb-3 text-neutral-400">Not in any showcase yet.</p>
  {:else}
    <ul class="c-2 mb-3">
      {#each data.showcases as s}
        <li class="r-2 items-center justify-between text-sm">
          <a
            class="text-neutral-200 hover:text-neutral-100"
            href="/admin/showcases/{s.id}"
          >
            {s.name}
            <span class="text-neutral-500"
              >({s.kind === "drop" ? "drop" : "always on"})</span
            >
          </a>
          <form
            method="POST"
            action="?/removeFromShowcase"
            use:enhance={toastSubmit({ success: "Removed" })}
          >
            <input type="hidden" name="showcase_id" value={s.id} />
            <button class="btn neutral sm text-error-400">Remove</button>
          </form>
        </li>
      {/each}
    </ul>
  {/if}
  {#if data.availableShowcases.length > 0}
    <form
      method="POST"
      action="?/addToShowcase"
      class="r-2 max-w-md items-end"
      use:enhance={toastSubmit({ success: "Added to showcase" })}
    >
      <label class="flex-1">
        Add to showcase
        <select class="default" name="showcase_id" required>
          {#each data.availableShowcases as s}
            <option value={s.id}>
              {s.name}{s.kind === "always_on" ? " (always on)" : ""}
            </option>
          {/each}
        </select>
      </label>
      <button class="btn neutral sm">Add</button>
    </form>
  {/if}
</section>

<section>
  <div class="r-4 mb-3 items-center justify-between">
    <h2 class="h4 text-neutral-100">
      {axisName ? `${axisName[0].toUpperCase()}${axisName.slice(1)}` : "Variants"}
    </h2>
    {#if orderDirty}
      <div class="r-2 items-center text-sm">
        <span class="text-neutral-400">Unsaved order</span>
        <button class="btn neutral sm" type="button" onclick={discardOrder}>Discard</button>
        <button class="btn primary sm" type="button" onclick={saveOrder}>Save order</button>
      </div>
    {/if}
  </div>

  {#if orderedVariants.length > 0}
    <ul
      class="mb-6 flex flex-wrap gap-2"
      role="presentation"
      ondragover={onContainerOver}
      ondrop={onDrop}
    >
      {#each orderedVariants as v (v.id)}
        <li
          data-tile-id={v.id}
          class="bg-primary-950/40 border-primary-800/60 group relative grid size-20 cursor-grab place-items-center rounded-lg border select-none"
          class:hidden={dragId === v.id}
          class:ring-2={dragOverId === v.id && dragId !== null && dragId !== v.id}
          class:ring-primary-400={dragOverId === v.id && dragId !== null && dragId !== v.id}
          class:scale-105={dragOverId === v.id && dragId !== null && dragId !== v.id}
          draggable="true"
          ondragstart={(e) => onDragStart(e, v.id)}
          ondragend={onDragEnd}
        >
          <span class="text-base font-semibold text-neutral-100">
            {variantLabel(v.options)}
          </span>
          <form
            method="POST"
            action="?/deleteVariant"
            class="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
            use:enhance={toastSubmit({ success: "Removed" })}
          >
            <input type="hidden" name="variant_id" value={v.id} />
            <button
              type="submit"
              class="bg-error-600 hover:bg-error-400 flex size-5 cursor-pointer items-center justify-center rounded-full text-sm font-bold text-neutral-100 shadow-md"
              aria-label="Remove {variantLabel(v.options)}"
              draggable="false"
              onmousedown={(e) => e.stopPropagation()}
              ondragstart={(e) => e.preventDefault()}
            >
              ×
            </button>
          </form>
        </li>
      {/each}
    </ul>
  {/if}

  {#if !axisName}
    <p class="helper-text">Set a variant axis above to add values.</p>
  {:else}
    <form
      method="POST"
      action="?/addVariantRun"
      autocomplete="off"
      class="r-4 mb-3 max-w-2xl items-end"
      use:enhance={toastSubmit({ success: "Added" })}
    >
      <label class="flex-1">
        Add several at once (comma-separated)
        <input
          class="default"
          type="text"
          name="values"
          placeholder={axisName === "size" ? "S, M, L, XL, 2XL" : "value, value"}
          autocomplete="off"
          data-lpignore="true"
          required
        />
      </label>
      <button class="btn neutral sm">Add all</button>
    </form>

    <form
      method="POST"
      action="?/addVariant"
      autocomplete="off"
      class="r-4 max-w-2xl items-end"
      use:enhance={toastSubmit({ success: "Added" })}
    >
      <label class="flex-1">
        Add one
        <input
          class="default"
          type="text"
          name="value"
          autocomplete="off"
          data-lpignore="true"
          required
        />
      </label>
      <button class="btn neutral sm">Add</button>
    </form>
  {/if}
</section>
