<script lang="ts">
    import { fade } from "svelte/transition";
    import Grid from "$lib/components/Grid.svelte";
</script>

<main
    class="absolute left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-4 lg:gap-0"
    in:fade
>
    <Grid />
    <div class="card variant-soft-secondary rounded-3xl p-5">
        <div class="flex flex-col items-center lg:flex-row lg:gap-8">
            <img src="/logo/dark/logo-white-cat.svg" alt="Logo" class="size-48" />
            <h1 class="h2 text-center lg:h1">
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
