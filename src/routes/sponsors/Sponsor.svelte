<script lang="ts">
    import type { SponsorData } from "./data";

    interface Props {
        sponsor: SponsorData;
    }

    let { sponsor }: Props = $props();

    const id = $derived(sponsor.name.toLowerCase().replace(" ", "-"));
</script>

<div class="h-40 w-72">
    <img
        class="layer h-20 rounded-lg bg-white bg-opacity-50 object-contain p-8"
        src={sponsor.logo}
        alt="{sponsor.name} logo"
    />

    <a href="/sponsors/{id}">
        <div
            class="layer rounded-lg bg-black bg-opacity-80 opacity-0 duration-200 hover:opacity-100 hover:backdrop-blur-sm"
        >
            <div
                class="text-sm font-bold uppercase tracking-tighter duration-300 hover:tracking-wider"
            >
                <span class="text-3xl text-white">{sponsor.name}</span> <br />
                <span class="text-gray-200">Learn More -&gt;</span>
            </div>
        </div>
    </a>
</div>

<style lang="postcss">
    .layer {
        @apply absolute flex h-40 w-72 items-center justify-center;
    }
</style>
