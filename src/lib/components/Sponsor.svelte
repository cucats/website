<script lang="ts">
    import type { PageProps } from "./$types";
    let { sponsor }: PageProps = $props();

    let id = sponsor.name.toLowerCase().replace(" ", "-");
</script>

<div class="sponsor-card">
    <img class="layer" src={sponsor.logo} alt="{sponsor.name} logo" />

    <div class="layer rounded-xl opacity-0 duration-200 hover:opacity-100 hover:backdrop-blur-sm">
        <a class="layer" href="/sponsors/{id}">
            <div>
                <span class="text-3xl text-white">{sponsor.name}</span> <br />
                Learn More ->
            </div>
        </a>
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
        @apply rounded-lg bg-black bg-opacity-80 text-sm font-bold uppercase text-gray-200 opacity-0 duration-[400ms] hover:opacity-100;
    }
</style>
