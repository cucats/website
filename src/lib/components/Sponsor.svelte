<script lang="ts">
    import type { PageProps } from "./$types";
    let { sponsor }: PageProps = $props();

    let id = sponsor.name.toLowerCase().replace(" ", "-");
</script>

<div class="sponsor-card">
    <img class="layer" src={sponsor.logo} alt="{sponsor.name} logo" />

    <div class="layer rounded-xl opacity-0 duration-200 hover:opacity-100 hover:backdrop-blur-md">
        <a class="layer" href="/sponsors/{id}">Learn More</a>
    </div>
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

    a {
        @apply rounded-lg bg-black bg-opacity-80 text-xl font-bold uppercase opacity-0 duration-[400ms] hover:opacity-100;
    }
</style>
