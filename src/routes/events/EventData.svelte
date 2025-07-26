<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        icon: string;
        title: string;
        children: Snippet;
    }

    let { icon, title, children }: Props = $props();
</script>

<div class="flex items-start">
    <img src={icon} class="pixel mt-3 mr-3 size-8" alt={title} />
    <div>
        <h3 class="font-semibold">{title}</h3>
        {@render children()}
    </div>
</div>
