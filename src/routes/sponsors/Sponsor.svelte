<script lang="ts">
    import type { SponsorData } from "./data";

    interface Props {
        sponsor: SponsorData;
    }

    let { sponsor }: Props = $props();

    const id = $derived(sponsor.name.toLowerCase().replace(" ", "-"));
</script>

<div class="sponsor-card">
    <img class="layer" src={sponsor.logo} alt="{sponsor.name} logo" />

    <a class="layer" href="/sponsors/{id}">
        <div
            class="layer rounded-lg bg-black bg-opacity-80 opacity-0 duration-200 hover:opacity-100 hover:backdrop-blur-sm"
        >
            <div class="layer tracking-tighter duration-300 hover:tracking-wider">
                <div class="text-sm font-bold uppercase text-gray-200">
                    <span class="text-3xl text-white">{sponsor.name}</span> <br />
                    Learn More -&gt;
                </div>
            </div>
        </div>
    </a>
</div>

<style lang="postcss">
    .sponsor-card {
        @apply h-40 w-72;
    }

    .layer {
        @apply absolute flex h-40 w-72 items-center justify-center;
    }

    img {
        @apply h-20 rounded-lg bg-white bg-opacity-50 object-contain p-8;
    }
</style>
