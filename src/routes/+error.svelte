<script lang="ts">
    import { page } from "$app/state";

    const { error, status } = page;
</script>

<section class="bg-secondary-500 pt-24">
    <div class="c-4 mx-auto max-w-5xl p-4">
        <h1 class="text-4xl font-bold md:text-5xl">{status}</h1>
        <h2 class="text-3xl font-bold md:text-4xl">{error?.message}</h2>
    </div>
</section>
