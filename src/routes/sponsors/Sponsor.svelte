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
  <img class="h-full object-contain" src={logo} alt="sponsor logo" />

  <!--
    Using overflow-clip on parent leaves a small gap on browsers for some reason.
    Instead, use a border with a smaller radius in child.
  -->
  <div
    class="absolute top-0 left-0 flex size-full items-center justify-center rounded-md bg-neutral-950/90 opacity-0 transition duration-200 group-hover:opacity-100 group-hover:backdrop-blur-sm"
  >
    <div class="text-center font-bold uppercase">
      <span class="block text-xl text-neutral-100">{@render name()}</span>
      <span class="mt-2 block text-sm text-neutral-200">Learn More -&gt;</span>
    </div>
  </div>
</button>

<Modal
  bind:active
  class="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-neutral-700 bg-neutral-900 p-4 shadow-2xl sm:p-8"
>
  <!-- Close button -->
  <button
    class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200"
    onclick={() => (active = false)}
    aria-label="Close modal"
  >
    <CloseIcon />
  </button>

  <!-- Modal body -->
  <div class="c-4 text-neutral-100">
    <h3 class="h3 mb-4 font-bold">
      {@render name()}
    </h3>
    <div class="c-4 p">
      {@render children()}
    </div>
  </div>
</Modal>
