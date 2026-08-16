<script lang="ts">
  import type { Snippet } from "svelte";
  import Modal from "$lib/components/Modal.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";

  interface Props {
    tier: "gold" | "silver" | "bronze";
    name: Snippet;
    logo: string;
    children: Snippet;
  }

  let { name, logo, children, tier }: Props = $props();

  let avif = $derived(
    logo.endsWith(".png") && !logo.includes("optiver")
      ? logo.replace(/\.png$/, ".avif")
      : null,
  );

  let active = $state(false);

  let buttonSize = $derived(
    tier === "gold"
      ? "w-80 h-48"
      : tier === "silver"
        ? "w-70 h-42"
        : "w-60 h-36",
  );
</script>

<button
  class="group relative flex cursor-pointer items-center justify-center rounded-lg bg-neutral-100 p-8 {buttonSize}"
  onclick={() => (active = true)}
>
  {#if avif}
    <picture>
      <source srcset={avif} type="image/avif" />
      <img class="h-full object-contain" src={logo} alt="sponsor logo" />
    </picture>
  {:else}
    <img class="h-full object-contain" src={logo} alt="sponsor logo" />
  {/if}

  <!--
    Using overflow-clip on parent leaves a small gap on browsers for some reason.
    Instead, use a border with a smaller radius in child.
  -->
  <div
    class="absolute top-0 left-0 flex size-full items-center justify-center rounded-lg bg-black/70 opacity-0 duration-300 group-hover:opacity-100 group-hover:backdrop-blur-lg"
  >
    <div class="text-center font-bold">
      <span class="card-title block text-neutral-50">{@render name()}</span>
      <span class="mt-2 block text-sm text-neutral-50">Learn More -&gt;</span>
    </div>
  </div>
</button>

<Modal
  bind:active
  class="bg-primary-900 relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg p-4 shadow-overlay sm:p-8"
>
  <!-- Close button -->
  <button
    class="absolute top-4 right-4 cursor-pointer text-neutral-400 hover:text-neutral-100"
    onclick={() => (active = false)}
    aria-label="Close modal"
  >
    <CloseIcon />
  </button>

  <!-- Modal body -->
  <div class="c-4 text-neutral-200">
    <h3 class="h3 font-bold">
      {@render name()}
    </h3>
    <div class="c-4 p">
      {@render children()}
    </div>
  </div>
</Modal>
