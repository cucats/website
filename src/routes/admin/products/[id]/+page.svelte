<script lang="ts">
  import { untrack } from "svelte";
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import type { PageData, ActionData } from "./$types";
  import { variantLabel } from "$lib/utils";
  import { toastSubmit } from "$lib/enhanceWithToast";
  import { toasts } from "$lib/toasts.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const hasVariants = $derived(data.variants.length > 0);

  let order = $state<number[]>(untrack(() => data.variants.map((v) => v.id)));
  $effect(() => {
    if (dragId !== null) return;
    order = data.variants.map((v) => v.id);
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

  function onDragStart(e: DragEvent, id: number) {
    dragId = id;
    e.dataTransfer?.setData("text/plain", String(id));
    if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e: DragEvent, id: number) {
    if (dragId == null || dragId === id) return;
    e.preventDefault();
    dragOverId = id;
  }

  async function onDrop(e: DragEvent) {
    e.preventDefault();
    if (dragId == null || dragOverId == null || dragId === dragOverId) {
      dragId = null;
      dragOverId = null;
      return;
    }
    const moving = dragId;
    const overId = dragOverId;
    dragId = null;
    dragOverId = null;
    const next = order.filter((x) => x !== moving);
    const overIdx = next.indexOf(overId);
    if (overIdx < 0) return;
    next.splice(overIdx, 0, moving);
    order = next;
    const body = new FormData();
    body.set("ids", order.join(","));
    const res = await fetch("?/reorderVariants", { method: "POST", body });
    if (res.ok) toasts.show("Order saved");
    else toasts.show("Could not save order", "error");
    await invalidateAll();
  }

  function onDragEnd() {
    dragId = null;
    dragOverId = null;
  }
</script>

<a class="text-sm text-neutral-400 hover:text-neutral-100" href="/admin/products">
  ← Products
</a>
<h1 class="h2 mt-2 mb-6 text-neutral-100">{data.product.name}</h1>

{#if form?.error}
  <p class="helper-text error mb-4">{form.error}</p>
{/if}

{#if !hasVariants}
  <p class="helper-text mb-6">
    This product has no variants yet — members can't order it until you add at
    least one.
  </p>
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
      Price (£) — same across all variants
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
  <h2 class="h4 mb-3 text-neutral-100">Variants</h2>
  {#if !hasVariants}
    <p class="p mb-3 text-neutral-400">No variants yet — add some below.</p>
  {:else}
    <p class="helper-text mb-3">Drag chips to reorder.</p>
    <ul class="mb-6 flex flex-wrap gap-2">
      {#each orderedVariants as v (v.id)}
        {#if dragOverId === v.id && dragId !== null && dragId !== v.id}
          <li
            class="bg-primary-500/10 border-primary-400 h-[40px] w-20 rounded-lg border-2 border-dashed"
            ondragover={(e) => e.preventDefault()}
            ondrop={onDrop}
          ></li>
        {/if}
        <li
          class="r-3 bg-primary-950/40 border-primary-800/60 group cursor-grab items-center rounded-lg border px-3 py-2 select-none"
          class:!opacity-30={dragId === v.id}
          class:opacity-60={!v.enabled}
          draggable="true"
          ondragstart={(e) => onDragStart(e, v.id)}
          ondragover={(e) => onDragOver(e, v.id)}
          ondrop={onDrop}
          ondragend={onDragEnd}
        >
          <span
            class="text-sm font-semibold text-neutral-100"
            class:line-through={!v.enabled}
          >
            {variantLabel(v.options)}
          </span>
          <div class="r-1 ml-1 opacity-60 transition-opacity group-hover:opacity-100">
            <form
              method="POST"
              action="?/toggleVariantEnabled"
              use:enhance={toastSubmit({ success: "Updated" })}
            >
              <input type="hidden" name="variant_id" value={v.id} />
              <button
                class="text-xs text-neutral-400 hover:text-neutral-100"
                title={v.enabled ? "Disable" : "Enable"}
              >
                {v.enabled ? "⊘" : "✓"}
              </button>
            </form>
            <form
              method="POST"
              action="?/deleteVariant"
              use:enhance={toastSubmit({ success: "Deleted" })}
            >
              <input type="hidden" name="variant_id" value={v.id} />
              <button
                class="text-xs text-error-400 hover:text-error-600"
                title="Delete"
                onclick={(e) => {
                  if (!confirm(`Delete ${variantLabel(v.options)}?`))
                    e.preventDefault();
                }}
              >
                ×
              </button>
            </form>
          </div>
        </li>
      {/each}
    </ul>
  {/if}

  <details class="mb-3" open={!hasVariants}>
    <summary class="cursor-pointer text-sm text-neutral-300">
      Quick add — size run
    </summary>
    <form
      method="POST"
      action="?/addVariantRun"
      autocomplete="off"
      class="r-4 mt-2 max-w-2xl items-end"
      use:enhance={toastSubmit({ success: "Variants added" })}
    >
      <input type="hidden" name="option_key" value="size" />
      <label class="flex-1">
        Sizes (comma-separated)
        <input
          class="default"
          type="text"
          name="values"
          value="S, M, L, XL, 2XL"
          autocomplete="off"
          data-lpignore="true"
          required
        />
      </label>
      <button class="btn neutral sm">Add all</button>
    </form>
  </details>

  <details>
    <summary class="cursor-pointer text-sm text-neutral-300">
      Add single variant
    </summary>
    <form
      method="POST"
      action="?/addVariant"
      autocomplete="off"
      class="r-4 mt-2 max-w-2xl items-end"
      use:enhance={toastSubmit({ success: "Variant added" })}
    >
      <label class="flex-1">
        Options
        <input
          class="default"
          type="text"
          name="options"
          placeholder="size=M, colour=Black"
          autocomplete="off"
          data-lpignore="true"
        />
      </label>
      <button class="btn neutral sm">Add</button>
    </form>
  </details>
</section>
