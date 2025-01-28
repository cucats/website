<script>
    export let sponsor;

    let colours = new Map([
        ["gold", ["#ffc000", "#ffa000"]],
        ["silver", ["#cccccc", "#888888"]],
        ["bronze", ["#ffa000", "#cc8033"]],
    ]);
</script>

<!-- Couldn't get tailwind to work so just set style manually... -->
<div
    class="sponsor-card"
    style="background: linear-gradient(
        {colours.get(sponsor.tier)?.[0]},
        {colours.get(sponsor.tier)?.[1]}
    )"
>
    <img src={sponsor.logo} alt="{sponsor.name} logo" />

    <!--
    {#each sponsor.paragraphs as paragraph}
        <p>{paragraph}</p>
    {/each}

    <div class="button-container">
        {#each Object.entries(sponsor.links) as [key, value]}
            <a href={value} class="btn variant-outline-primary capitalize">{key}</a>
        {/each}
    </div>
    -->
</div>

<style lang="postcss">
    .sponsor-card {
        @apply flex flex-col w-96 items-center rounded-xl p-4 shadow-sm hover:shadow-2xl hover:scale-105 transition mx-auto;

        img {
            @apply object-contain h-24 my-8;
        }
    }

    .button-container {
        @apply flex justify-center w-full pt-4 gap-x-8 gap-y-4 flex-wrap;
    }
</style>
