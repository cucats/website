<script lang="ts">
  import type { ActionData } from "./$types";

  let { form }: { form: ActionData } = $props();
</script>

<a class="text-sm text-neutral-400 hover:text-neutral-100" href="/admin/products">
  ← Products
</a>
<h1 class="h2 mt-2 mb-2 text-neutral-100">New product</h1>
<p class="p mb-6 text-neutral-400">
  Create the product first — you can add variants and put it in showcases on the
  next step.
</p>

{#if form?.error}
  <p class="helper-text error mb-4">{form.error}</p>
{/if}

<form
  method="POST"
  enctype="multipart/form-data"
  autocomplete="off"
  class="c-4 max-w-xl"
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
      placeholder="e.g. CUCaTS Hoodie"
      value={form?.title ?? ""}
      required
    />
  </label>
  <label for="product-description">
    Description
    <textarea
      id="product-description"
      class="default min-h-24"
      name="description"
      autocomplete="off"
      data-form-type="other"
      data-lpignore="true"
      rows="3"
      placeholder="A short description shown to members"
      >{form?.description ?? ""}</textarea
    >
  </label>
  <label for="product-image">
    Image
    <input
      id="product-image"
      class="default"
      type="file"
      name="image"
      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
    />
  </label>
  <div class="r-3">
    <button class="btn primary md">Create product</button>
    <a class="btn neutral md" href="/admin/products">Cancel</a>
  </div>
</form>
