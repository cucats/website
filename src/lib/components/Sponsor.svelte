<script lang="ts">
    import type { PageProps } from "./$types";
    let { sponsor }: PageProps = $props();

    let id = sponsor.name.toLowerCase().replace(" ", "-");
</script>

<a class="sponsor-card" href="/sponsors/{id}">
    <img src={sponsor.logo} alt="{sponsor.name} logo" />
</a>

<style lang="postcss">
    .sponsor-card {
        @apply flex w-72 flex-col items-center rounded-xl bg-white bg-opacity-50 p-4 shadow-sm transition hover:scale-105 hover:shadow-2xl;

        img {
            @apply my-8 h-20 object-contain;
        }
    }
</style>
