<script>
    export let sponsor = {};
</script>

<section class="sponsor-card">
    <img src={sponsor.logo} alt="{sponsor.name} logo" />

    {#each sponsor.paragraphs as paragraph}
        <p>{paragraph}</p>
    {/each}

    <div class="button-container">
        {#each Object.entries(sponsor.links) as [key, value]}
            <a href={value} class="btn variant-outline-primary capitalize">{key}</a>
        {/each}
    </div>
</section>

<style lang="postcss">
    .sponsor-card {
        @apply flex flex-col w-full items-center gap-4 rounded-xl outline-primary-400 outline outline-1 bg-white bg-opacity-20 p-4 text-justify;

        img {
            @apply object-contain h-24 m-2;
        }
    }

    .button-container {
        @apply flex justify-center w-full pt-4 gap-x-8 gap-y-4 flex-wrap;
    }
</style>
