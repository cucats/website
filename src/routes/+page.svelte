<script lang="ts">
    import { fade } from "svelte/transition";
    import Grid from "$lib/components/Grid.svelte";
</script>

<main
    class="flex items-center justify-center absolute w-screen h-screen left-0 top-0 flex-col gap-4 lg:gap-0"
    in:fade
>
    <Grid />
    <div class="card variant-soft-secondary p-5 rounded-3xl">
        <div class="flex items-center lg:gap-8 flex-col lg:flex-row">
            <img src="/logo/dark/logo-white-cat.svg" alt="Logo" class="size-48" />
            <h1 class="h2 lg:h1 text-center">
                Cambridge Uni Computing
                <br />
                and Technology Society
            </h1>
        </div>
        <p class="mx-10 text-center">
            The main student-led CS and tech society at the University of Cambridge!
        </p>
    </div>
</main>
