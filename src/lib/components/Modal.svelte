<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    active: boolean;
  }

  let { active = $bindable(), ...props }: Props = $props();

  const onkeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      active = false;
    }
  };

  $effect(() => {
    if (active) {
      document.addEventListener("keydown", onkeydown);

      return () => {
        document.removeEventListener("keydown", onkeydown);
      };
    }
  });
</script>

{#if active}
  <!-- Modal backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    onclick={() => (active = false)}
    {onkeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    transition:fade={{ duration: 200 }}
  >
    <!-- Modal content -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      {...props}
      onclick={(e) => e.stopPropagation()}
      transition:scale={{ duration: 200, start: 0.9 }}
    >
      {@render props.children?.()}
    </div>
  </div>
{/if}
