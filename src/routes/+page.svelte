<script lang="ts">
    import { fade } from "svelte/transition";
    import GameOfLife from "./GameOfLife.svelte";
</script>

<GameOfLife />

<main
    class="flex h-screen flex-col items-center justify-center gap-4 overflow-x-hidden lg:gap-0"
    in:fade
>
    <div class="flex flex-col items-center lg:flex-row lg:gap-8">
        <img src="/assets/logo/dark/logo-white-cat.svg" alt="CUCaTS logo" class="size-48" />
        <h1 class="z-10 text-center normal-case">
            Cambridge University Computing
            <br />
            and Technology Society
        </h1>
    </div>
    <p class="z-10 mx-10 text-center">
        The main student-led CS and tech society at the University of Cambridge!
    </p>
</main>
