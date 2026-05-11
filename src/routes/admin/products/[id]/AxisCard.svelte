<script lang="ts">
  import { untrack } from "svelte";
  import { enhance } from "$app/forms";
  import { beforeNavigate } from "$app/navigation";
  import { toastSubmit } from "$lib/enhanceWithToast";
  import { toasts } from "$lib/toasts.svelte";

  let {
    axis,
  }: {
    axis: { id: number; name: string; values: string[]; display_order: number };
  } = $props();

  let order = $state<string[]>(untrack(() => [...axis.values]));
  let savedSnapshot = $state<string[]>(untrack(() => [...axis.values]));
  const orderDirty = $derived(order.join("\0") !== savedSnapshot.join("\0"));

  $effect(() => {
    if (dragValue !== null) return;
    const a = new Set(axis.values);
    const o = new Set(order);
    let sameSet = a.size === o.size;
    if (sameSet) for (const v of a) if (!o.has(v)) { sameSet = false; break; }
    if (!sameSet) {
      order = [...axis.values];
      savedSnapshot = [...axis.values];
    }
  });

  let dragValue = $state<string | null>(null);
  let dropIndex = $state(0);
  let clickOffsetX = 0;
  let clickOffsetY = 0;
  let dragWidth = 0;
  let dragHeight = 0;

  // The order the user sees while dragging — `dragValue` moved to the
  // computed insertion index so the surrounding chips reflow continuously.
  const previewOrder = $derived.by(() => {
    if (dragValue === null) return order;
    const without = order.filter((x) => x !== dragValue);
    const idx = Math.max(0, Math.min(dropIndex, without.length));
    without.splice(idx, 0, dragValue);
    return without;
  });

  let addValue = $state("");
  let addInput: HTMLInputElement | undefined = $state();

  function onDragStart(e: DragEvent, value: string) {
    dragValue = value;
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    clickOffsetX = e.clientX - r.left;
    clickOffsetY = e.clientY - r.top;
    dragWidth = r.width;
    dragHeight = r.height;
    e.dataTransfer?.setData("text/plain", value);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      // Suppress the browser's default drag image — the in-list ghost
      // chip is the preview the user should look at.
      const img = new Image();
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      e.dataTransfer.setDragImage(img, 0, 0);
    }
  }
  function onDragEnd() {
    dragValue = null;
  }
  function onContainerOver(e: DragEvent) {
    if (dragValue == null) return;
    e.preventDefault();
    const centerX = e.clientX - clickOffsetX + dragWidth / 2;
    const centerY = e.clientY - clickOffsetY + dragHeight / 2;
    const container = e.currentTarget as HTMLElement;
    const tiles = Array.from(
      container.querySelectorAll<HTMLElement>("[data-value]"),
    ).filter((t) => t.dataset.value !== dragValue);
    // Stable insertion index: count tiles that should appear before the
    // dragged element's center. Reading order = earlier row, or same row
    // with smaller x-center. The number doesn't oscillate as the preview
    // reflows because reflowed positions preserve the ordering relation.
    let count = 0;
    for (const t of tiles) {
      const r = t.getBoundingClientRect();
      const tx = (r.left + r.right) / 2;
      const ty = (r.top + r.bottom) / 2;
      const halfRow = (r.bottom - r.top) / 2;
      if (ty < centerY - halfRow) count++;
      else if (Math.abs(ty - centerY) <= halfRow && tx < centerX) count++;
    }
    dropIndex = count;
  }
  function onDrop(e: DragEvent) {
    e.preventDefault();
    if (dragValue == null) return;
    const committed = previewOrder;
    dragValue = null;
    order = committed;
  }

  async function saveOrder() {
    const body = new FormData();
    body.set("axis_id", String(axis.id));
    for (const v of order) body.append("value", v);
    const res = await fetch("?/reorderAxisValues", { method: "POST", body });
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

  beforeNavigate(({ cancel }) => {
    if (
      orderDirty &&
      !confirm("You have unsaved value order changes. Leave anyway?")
    ) {
      cancel();
    }
  });
</script>

<div class="bg-primary-950/40 border-primary-800/60 rounded-lg border p-4">
  <div class="r-2 mb-3 items-center">
    <form
      method="POST"
      action="?/renameAxis"
      class="r-2 flex-1 items-center"
      use:enhance={toastSubmit({ success: "Axis renamed" })}
    >
      <input type="hidden" name="axis_id" value={axis.id} />
      <input
        class="default max-w-xs flex-1"
        type="text"
        name="name"
        value={axis.name}
        autocomplete="off"
        data-lpignore="true"
        required
      />
      <button class="btn neutral sm">Rename</button>
    </form>
    {#if orderDirty}
      <span class="text-sm text-neutral-400">Unsaved order</span>
      <button type="button" class="btn neutral sm" onclick={discardOrder}>Discard</button>
      <button type="button" class="btn primary sm" onclick={saveOrder}>Save order</button>
    {/if}
    <form
      method="POST"
      action="?/removeAxis"
      use:enhance={toastSubmit({ success: "Removed" })}
    >
      <input type="hidden" name="axis_id" value={axis.id} />
      <button
        type="submit"
        class="btn neutral sm text-error-400"
        onclick={(e) => {
          if (!confirm(`Remove axis "${axis.name}"?`)) e.preventDefault();
        }}
      >
        Remove axis
      </button>
    </form>
  </div>

  <div
    class="flex flex-wrap gap-2"
    role="list"
    ondragover={onContainerOver}
    ondrop={onDrop}
  >
    {#each previewOrder as value (value)}
      <div
        data-value={value}
        draggable="true"
        role="listitem"
        ondragstart={(e) => onDragStart(e, value)}
        ondragend={onDragEnd}
        class="group bg-primary-900 border-primary-700 relative grid size-20 cursor-grab place-items-center rounded-lg border-2 select-none"
        class:opacity-40={dragValue === value}
        class:ring-2={dragValue === value}
        class:ring-primary-400={dragValue === value}
      >
        <span class="text-base font-semibold text-neutral-100">{value}</span>
        <form
          method="POST"
          action="?/removeAxisValue"
          class="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
          use:enhance={toastSubmit({ success: "Removed" })}
        >
          <input type="hidden" name="axis_id" value={axis.id} />
          <input type="hidden" name="value" value={value} />
          <button
            type="submit"
            class="bg-error-600 hover:bg-error-400 flex size-5 cursor-pointer items-center justify-center rounded-full text-sm font-bold text-neutral-100 shadow-md"
            aria-label="Remove {value}"
            draggable="false"
            onmousedown={(e) => e.stopPropagation()}
            ondragstart={(e) => e.preventDefault()}
          >
            ×
          </button>
        </form>
      </div>
    {/each}

    <form
      method="POST"
      action="?/addAxisValue"
      class="size-20"
      use:enhance={() =>
        async ({ result, update }) => {
          if (result.type === "success") {
            toasts.show("Added");
            addValue = "";
            queueMicrotask(() => addInput?.focus());
          } else if (result.type === "failure") {
            toasts.show("Could not add", "error");
          }
          await update();
        }}
    >
      <input type="hidden" name="axis_id" value={axis.id} />
      <input
        bind:this={addInput}
        bind:value={addValue}
        name="value"
        placeholder="+"
        class="bg-primary-950/20 hover:bg-primary-950/40 border-primary-800/60 hover:border-primary-600 focus:border-primary-400 focus:placeholder:text-transparent size-20 rounded-lg border-2 border-dashed text-center text-base font-semibold text-neutral-100 placeholder:text-4xl placeholder:font-normal placeholder:text-neutral-500 focus:border-solid focus:outline-none"
        autocomplete="off"
        data-lpignore="true"
        required
      />
    </form>
  </div>
</div>
