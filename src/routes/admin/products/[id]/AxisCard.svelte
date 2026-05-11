<script lang="ts">
  import { enhance } from "$app/forms";
  import { toastSubmit } from "$lib/enhanceWithToast";
  import { beforeNavigate } from "$app/navigation";

  let {
    axis,
  }: {
    axis: { id: number; name: string; values: string[]; display_order: number };
  } = $props();

  let localValues = $state<string[]>([...axis.values]);
  let dragging = $state<string | null>(null);
  let dragOver = $state<string | null>(null);

  // When the server returns a fresh snapshot after add/remove (the set of
  // values differs), reset the local working copy. A drag-reorder doesn't
  // change the set, so the user's pending reorder survives.
  $effect(() => {
    if (dragging) return;
    const a = new Set(axis.values);
    const l = new Set(localValues);
    let same = a.size === l.size;
    if (same) for (const v of a) if (!l.has(v)) { same = false; break; }
    if (!same) localValues = [...axis.values];
  });

  let orderDirty = $derived(
    localValues.length !== axis.values.length ||
      localValues.some((v, i) => v !== axis.values[i]),
  );

  beforeNavigate(({ cancel }) => {
    if (orderDirty && !confirm("Discard unsaved value order?")) cancel();
  });

  function onDragStart(e: DragEvent, value: string) {
    dragging = value;
    if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
  }
  function onDragOver(e: DragEvent, value: string) {
    if (dragging === null) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    if (value !== dragging) dragOver = value;
  }
  function onDrop(e: DragEvent, target: string) {
    e.preventDefault();
    if (!dragging || dragging === target) {
      dragging = null;
      dragOver = null;
      return;
    }
    const from = localValues.indexOf(dragging);
    const to = localValues.indexOf(target);
    if (from < 0 || to < 0) return;
    const next = [...localValues];
    next.splice(from, 1);
    next.splice(to, 0, dragging);
    localValues = next;
    dragging = null;
    dragOver = null;
  }
  function onDragEnd() {
    dragging = null;
    dragOver = null;
  }
  function discard() {
    localValues = [...axis.values];
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

  <ul class="mb-2 flex flex-wrap gap-2">
    {#each localValues as value (value)}
      <li
        draggable="true"
        ondragstart={(e) => onDragStart(e, value)}
        ondragover={(e) => onDragOver(e, value)}
        ondrop={(e) => onDrop(e, value)}
        ondragend={onDragEnd}
        class="bg-primary-950/40 border-primary-800/60 group relative grid min-h-20 min-w-20 cursor-grab place-items-center rounded-lg border px-3 py-2 select-none"
        class:opacity-30={dragging === value}
        class:ring-2={dragOver === value}
        class:ring-primary-400={dragOver === value}
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
            draggable="false"
            onmousedown={(e) => e.stopPropagation()}
            class="bg-error-600 hover:bg-error-400 flex size-5 cursor-pointer items-center justify-center rounded-full text-sm font-bold text-neutral-100 shadow-md"
            aria-label="Remove {value}"
          >
            ×
          </button>
        </form>
      </li>
    {/each}

    <li>
      <form
        method="POST"
        action="?/addAxisValue"
        class="r-2 items-center"
        use:enhance={toastSubmit({ success: "Added" })}
      >
        <input type="hidden" name="axis_id" value={axis.id} />
        <input
          class="default w-32"
          type="text"
          name="value"
          placeholder="add value"
          autocomplete="off"
          data-lpignore="true"
          required
        />
        <button class="btn neutral sm">+</button>
      </form>
    </li>
  </ul>

  {#if orderDirty}
    <form
      method="POST"
      action="?/reorderAxisValues"
      class="r-2 mt-2 items-center"
      use:enhance={toastSubmit({ success: "Order saved" })}
    >
      <input type="hidden" name="axis_id" value={axis.id} />
      {#each localValues as v}
        <input type="hidden" name="value" value={v} />
      {/each}
      <button class="btn primary sm">Save order</button>
      <button type="button" class="btn neutral sm" onclick={discard}>Discard</button>
    </form>
  {/if}
</div>
