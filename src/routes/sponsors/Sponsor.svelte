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
</script>

<button
  class={[
    "group relative flex cursor-pointer items-center rounded-lg bg-neutral-200",
    {
      "h-48 w-80": tier === "gold",
      "h-40 w-72": tier === "silver",
      "h-32 w-64": tier === "bronze",
    },
  ]}
  onclick={() => (active = true)}
>
  <img
    class={[
      "w-full object-contain p-6",
      {
        "h-36": tier === "gold",
        "h-32": tier === "silver",
        "h-24": tier === "bronze",
      },
    ]}
    src={logo}
    alt="sponsor logo"
  />

  <!--
    Using overflow-clip on parent leaves a small gap on browsers for some reason.
    Instead, use a border with a smaller radius in child.
  -->
  <div
    class="absolute top-0 left-0 flex size-full items-center justify-center rounded-md bg-neutral-950/90 opacity-0 duration-200 group-hover:opacity-100 group-hover:backdrop-blur-sm"
  >
    <div class="text-center font-bold uppercase">
      <span
        class={[
          "block text-neutral-100",
          {
            "text-2xl": tier === "gold",
            "text-xl": tier === "silver",
            "text-lg": tier === "bronze",
          },
        ]}>{@render name()}</span
      >
      <span class="mt-2 block text-sm text-neutral-200">Learn More -&gt;</span>
    </div>
  </div>
</button>

<Modal
  bind:active
  class="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-neutral-800 p-4 shadow-2xl sm:p-8"
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
    <h3 class="mb-4 text-xl font-bold sm:text-2xl">
      {@render name()}
    </h3>
    <div class="c-4 text-base sm:text-lg">
      {@render children()}
    </div>
  </div>
</Modal>
