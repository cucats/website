<script lang="ts">
    import type { Snippet } from "svelte";
    import { fade, scale } from "svelte/transition";
    import { onMount } from "svelte";

    interface Props {
        active: boolean;
        children: Snippet;
        // Customizable styles
        class?: string;
    }

    let { active = $bindable(), children, class: className = "relative" }: Props = $props();

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
        class="p-4-8 fixed inset-0 z-50 flex items-center justify-center"
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
            class={className}
            onclick={(e) => e.stopPropagation()}
            transition:scale={{ duration: 200, start: 0.9 }}
        >
            {@render children()}
        </div>
    </div>
{/if}
