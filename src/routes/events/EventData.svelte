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
    <h3 class="text-xs font-bold text-neutral-400 uppercase">
      {title}
    </h3>

    {@render children?.()}
  </div>
</div>
