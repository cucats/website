<script lang="ts">
    import { fade } from "svelte/transition";
    import Sponsor from "$lib/components/Sponsor.svelte";
    import sponsors from "../../data/sponsors.json";
</script>

<main class="p-4 flex flex-col gap-y-4 max-w-screen-lg mx-auto lg:pt-12 lg:gap-y-8" in:fade>
    <h1 class="h1 mb-4">Sponsors</h1>

    Click on sponsors for more information and opportunities!

    <h2 class="h2 text-[#ffc000]">Gold</h2>

    <div class="sponsor-container">
        {#each sponsors as sponsor}
            {#if sponsor.tier == "gold"}
                <Sponsor {sponsor} />
            {/if}
        {/each}
    </div>

    <h2 class="h2 text-white">Silver</h2>

    <div class="sponsor-container">
        {#each sponsors as sponsor}
            {#if sponsor.tier == "silver"}
                <Sponsor {sponsor} />
            {/if}
        {/each}
    </div>

    <h2 class="h2 text-[#fca956]">Bronze</h2>

    <div class="sponsor-container">
        {#each sponsors as sponsor}
            {#if sponsor.tier == "bronze"}
                <Sponsor {sponsor} />
            {/if}
        {/each}
    </div>
</main>

<style lang="postcss">
    .sponsor-container {
        @apply flex flex-wrap gap-4 justify-center;
    }
</style>
