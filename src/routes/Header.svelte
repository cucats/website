<script lang="ts">
    import Hamburger from "./Hamburger.svelte";
    import Navigation from "./Navigation.svelte";

    let active = $state(false);
</script>

<header
    class="fixed z-50 max-h-16 w-screen overflow-hidden font-mono transition-[max-height] duration-100 ease-out"
    class:w={active}
>
    <div class="bg-black bg-opacity-30 backdrop-blur-xl">
        <div class="relative mx-auto flex h-16 max-w-screen-xl items-center">
            <Hamburger bind:active />

            <!-- Logo -->
            <a href="/" class="contents" onclick={() => (active = false)}>
                <img
                    class="ml-8 size-8"
                    src="/assets/logo/dark/logo-white-cat.svg"
                    alt="CUCaTS logo of a white cat in ASCII art"
                />
                <span class="px-2 text-2xl font-extrabold">CUCaTS</span>
            </a>

            <!-- Links -->
            <div class="ml-auto mr-8 hidden sm:flex">
                <div class="flex"></div>
                <Navigation />
            </div>
        </div>

        <!-- Mobile drawer -->
        <div id="mobile-menu" class="pb-4 pl-4 sm:hidden">
            <Navigation bind:active />
        </div>
    </div>
</header>

<style lang="postcss">
    .w {
        @apply max-h-72 duration-200;
    }
</style>
