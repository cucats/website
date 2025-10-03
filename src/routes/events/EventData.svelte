<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Picture } from "vite-imagetools";

  interface Props {
    icon: string | Picture;
    title: string;
    children: Snippet;
  }

  let { icon, title, children }: Props = $props();
</script>

<div class="flex items-start">
  <enhanced:img src={icon} class="pixel mt-3 mr-3 size-8" alt={title} />
  <div class="flex-1">
    <h3 class="font-semibold">{title}</h3>
    {@render children()}
  </div>
</div>
