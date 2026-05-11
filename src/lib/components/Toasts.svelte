<script lang="ts">
  import { fly } from "svelte/transition";
  import { toasts } from "$lib/toasts.svelte";
</script>

<div
  class="pointer-events-none fixed right-4 bottom-4 z-[60] flex flex-col gap-2"
  aria-live="polite"
  aria-atomic="true"
>
  {#each toasts.items as t (t.id)}
    <div
      class="pointer-events-auto rounded-lg px-4 py-2 text-sm font-medium shadow-lg"
      class:bg-primary-600={t.kind === "success"}
      class:text-neutral-100={true}
      class:bg-error-600={t.kind === "error"}
      transition:fly={{ y: 20, duration: 200 }}
    >
      {t.message}
    </div>
  {/each}
</div>
