<script lang="ts">
    import { fade } from "svelte/transition";
    import Grid from "$lib/components/Grid.svelte";
</script>

<main
    class="absolute left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-4 overflow-x-hidden lg:gap-0"
    in:fade
>
    <Grid />
    <div class="flex flex-col items-center lg:flex-row lg:gap-8">
        <img src="/assets/logo/dark/logo-white-cat.svg" alt="CUCaTS logo" class="size-48" />
        <h1 class="z-10 text-center normal-case">
            Cambridge Uni Computing
            <br />
            and Technology Society
        </h1>
    </div>
    <p class="z-10 mx-10 text-center">
        The main student-led CS and tech society at the University of Cambridge!
    </p>
</main>
