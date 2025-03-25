<script lang="ts">
    import { fade } from "svelte/transition";
    import Sponsor from "$lib/components/Sponsor.svelte";
    import sponsors from "../../data/sponsors.json";
</script>

<main class="mx-auto flex max-w-screen-lg flex-col gap-y-4 p-4 lg:gap-y-8 lg:pt-12" in:fade>
    <h1>Sponsors</h1>

    <p>Click on sponsors for more information and opportunities!</p>

    <h2 class="text-[#ffc000]">Gold</h2>

    <div class="sponsor-container">
        {#each sponsors as sponsor}
            {#if sponsor.tier == "gold"}
                <Sponsor {sponsor} />
            {/if}
        {/each}
    </div>

    <h2 class="text-white">Silver</h2>

    <div class="sponsor-container">
        {#each sponsors as sponsor}
            {#if sponsor.tier == "silver"}
                <Sponsor {sponsor} />
            {/if}
        {/each}
    </div>

    <h2 class="text-[#fca956]">Bronze</h2>

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
        @apply flex flex-wrap justify-center gap-4;
    }
</style>
