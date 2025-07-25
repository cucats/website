<script lang="ts">
    import type { Snippet } from "svelte";
    import Modal from "$lib/components/Modal.svelte";
    import CloseIcon from "$lib/components/icons/CloseIcon.svelte";

    interface Props {
        tier: "large" | "medium" | "small";
        name: Snippet;
        logo: string;
        children: Snippet;
    }

    let { name, logo, children, tier }: Props = $props();

    let active = $state(false);
</script>

<button
    class="group relative flex {{
        large: 'h-48 w-80',
        medium: 'h-40 w-72',
        small: 'h-32 w-64',
    }[
        tier
    ]} cursor-pointer items-center justify-center overflow-hidden rounded-lg border-0 bg-neutral-200"
    onclick={() => (active = true)}
>
    <img
        class="{{
            large: 'h-36',
            medium: 'h-32',
            small: 'h-24',
        }[tier]} w-full object-contain p-6"
        src={logo}
        alt="sponsor logo"
    />

    <div
        class="absolute top-0 left-0 flex size-full items-center justify-center bg-neutral-950/90 opacity-0 duration-200 group-hover:opacity-100 group-hover:backdrop-blur-sm"
    >
        <div class="text-center font-bold tracking-tighter uppercase">
            <span
                class="{{
                    large: 'text-2xl',
                    medium: 'text-xl',
                    small: 'text-lg',
                }[tier]} block text-neutral-100">{@render name()}</span
            >
            <span class="mt-2 block text-sm text-neutral-200">Learn More -&gt;</span>
        </div>
    </div>
</button>

<Modal
    bind:active
    class="p-4-8 relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-neutral-800 shadow-2xl"
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
        <h3 class="mb-4 text-2xl font-bold text-neutral-100">{@render name()}</h3>
        {@render children()}
    </div>
</Modal>
