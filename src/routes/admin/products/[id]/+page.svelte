<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";
  import { toastSubmit } from "$lib/enhanceWithToast";
  import AxisCard from "./AxisCard.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();
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
        if (!confirm("Delete this product?")) e.preventDefault();
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
      use:enhance={toastSubmit({ success: "Added" })}
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

<section class="mb-10">
  <h2 class="h4 mb-3 text-neutral-100">Variants</h2>

  <div class="c-4 mb-4">
    {#each data.axes as axis (axis.id)}
      <AxisCard {axis} />
    {/each}
  </div>

  <form
    method="POST"
    action="?/addAxis"
    class="r-2 max-w-md items-end"
    use:enhance={toastSubmit({ success: "Axis added" })}
  >
    <label class="flex-1">
      Add axis
      <input
        class="default"
        type="text"
        name="name"
        placeholder="size"
        autocomplete="off"
        data-lpignore="true"
        required
      />
    </label>
    <button class="btn neutral sm">Add axis</button>
  </form>
</section>
