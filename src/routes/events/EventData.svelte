<script lang="ts">
  import type { Picture } from "vite-imagetools";

  interface Props {
    icon: Picture;
    title: string;
    children?: any;
  }

  let { icon, title, children }: Props = $props();
</script>

<div class="flex items-start">
  <enhanced:img src={icon} class="pixel mr-3 size-8" alt={title} />

  <div class="flex-1">
    <div class="text-xs font-semibold font-mono text-neutral-400 uppercase">
      {title}
    </div>

    {@render children?.()}
  </div>
</div>
