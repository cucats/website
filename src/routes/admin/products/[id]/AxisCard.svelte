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

  // Re-sync from server when the set of values changes (add/remove). A
  // pending reorder doesn't change the set, so we don't clobber it.
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
  let dragOver = $state<string | null>(null);
  let dropAtEnd = $state(false);
  let clickOffsetX = 0;
  let clickOffsetY = 0;
  let dragWidth = 0;
  let dragHeight = 0;

  let adding = $state(false);
  let addValue = $state("");

  function onDragStart(e: DragEvent, value: string) {
    dragValue = value;
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    clickOffsetX = e.clientX - r.left;
    clickOffsetY = e.clientY - r.top;
    dragWidth = r.width;
    dragHeight = r.height;
    e.dataTransfer?.setData("text/plain", value);
    if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
  }
  function onDragEnd() {
    dragValue = null;
    dragOver = null;
    dropAtEnd = false;
  }
  function onContainerOver(e: DragEvent) {
    if (dragValue == null) return;
    e.preventDefault();
    const centerX = e.clientX - clickOffsetX + dragWidth / 2;
    const centerY = e.clientY - clickOffsetY + dragHeight / 2;
    const container = e.currentTarget as HTMLElement;
    const tiles = container.querySelectorAll<HTMLElement>("[data-value]");
    let found: string | null = null;
    for (const t of tiles) {
      const v = t.dataset.value!;
      if (v === dragValue) continue;
      const r = t.getBoundingClientRect();
      if (
        centerX >= r.left &&
        centerX <= r.right &&
        centerY >= r.top &&
        centerY <= r.bottom
      ) {
        found = v;
        break;
      }
    }
    if (found !== null) {
      dragOver = found;
      dropAtEnd = false;
    } else {
      dragOver = null;
      dropAtEnd = true;
    }
  }
  function onDrop(e: DragEvent) {
    e.preventDefault();
    if (dragValue == null) return;
    const moving = dragValue;
    const overValue = dragOver;
    const atEnd = dropAtEnd;
    dragValue = null;
    dragOver = null;
    dropAtEnd = false;
    const next = order.filter((x) => x !== moving);
    if (atEnd || overValue == null) {
      next.push(moving);
    } else if (overValue === moving) {
      return;
    } else {
      const i = next.indexOf(overValue);
      if (i < 0) return;
      next.splice(i, 0, moving);
    }
    order = next;
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

  function startAdd() {
    adding = true;
    addValue = "";
    queueMicrotask(() => document.getElementById(`axis-${axis.id}-add`)?.focus());
  }
  function cancelAdd() {
    adding = false;
    addValue = "";
  }
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
    {#each order as value (value)}
      <div
        data-value={value}
        draggable="true"
        role="listitem"
        ondragstart={(e) => onDragStart(e, value)}
        ondragend={onDragEnd}
        class="group bg-primary-950/40 border-primary-800/60 relative grid size-20 cursor-grab place-items-center rounded-lg border select-none"
        class:hidden={dragValue === value}
        class:ring-4={dragOver === value && dragValue !== null}
        class:ring-primary-400={dragOver === value && dragValue !== null}
      >
        <span class="text-sm font-semibold text-neutral-100">{value}</span>
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

    {#if adding}
      <form
        method="POST"
        action="?/addAxisValue"
        class="size-20"
        use:enhance={() =>
          async ({ result, update }) => {
            if (result.type === "success") {
              toasts.show("Added");
              adding = false;
              addValue = "";
            } else if (result.type === "failure") {
              toasts.show("Could not add", "error");
            }
            await update();
          }}
      >
        <input type="hidden" name="axis_id" value={axis.id} />
        <input
          id="axis-{axis.id}-add"
          name="value"
          bind:value={addValue}
          onblur={() => {
            if (!addValue.trim()) cancelAdd();
          }}
          onkeydown={(e) => {
            if (e.key === "Escape") cancelAdd();
          }}
          class="bg-primary-950/40 border-primary-800/60 size-20 rounded-lg border text-center text-sm font-semibold text-neutral-100 focus:outline-none focus:border-primary-400"
          autocomplete="off"
          data-lpignore="true"
          required
        />
      </form>
    {:else}
      <button
        type="button"
        onclick={startAdd}
        class="group bg-primary-950/20 hover:bg-primary-950/40 border-primary-800/60 hover:border-primary-600 grid size-20 cursor-pointer place-items-center rounded-lg border-2 border-dashed transition-colors"
        aria-label="Add value"
      >
        <span class="text-3xl text-neutral-500 group-hover:text-neutral-300">+</span>
      </button>
    {/if}
  </div>
</div>
