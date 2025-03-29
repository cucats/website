<script lang="ts">
    import Navigation from "$lib/components/Navigation.svelte";
    import Hamburger from "$lib/components/Hamburger.svelte";
    import "../app.css";

    let { children } = $props();

    let active = $state(false);
</script>

<svelte:head>
    <title>CUCaTS</title>
</svelte:head>

<!-- Background gradient overlay -->
<div class="background"></div>

<!-- Navbar -->
<header
    class="fixed z-10 max-h-16 w-screen overflow-hidden font-mono transition-[max-height] duration-100 ease-out"
    class:w={active}
>
    <div class="bg-black bg-opacity-30 backdrop-blur-xl">
        <div class="relative mx-auto flex h-16 max-w-screen-xl items-center">
            <Hamburger bind:active />

            <!-- Logo -->
            <a href="/" class="contents" onclick={() => (active = false)}>
                <img
                    class="ml-8 size-8"
                    src="/logo/dark/logo-white-cat.svg"
                    alt="CUCaTS logo of a white cat in ASCII art"
                />
                <span class="px-2 text-2xl font-extrabold">CUCaTS</span>
            </a>

            <!-- Links -->
            <div class="ml-auto mr-8 hidden sm:block">
                <div class="flex">
                    <Navigation />
                </div>
            </div>
        </div>

        <!-- Mobile drawer -->
        <div id="mobile-menu" class="pb-4 pl-4 sm:hidden">
            <Navigation bind:active />
        </div>
    </div>
</header>

{@render children()}

<style lang="postcss">
    .w {
        @apply max-h-72 duration-200;
    }

    .background {
        @apply fixed -z-50 h-screen w-screen opacity-80;
        background: repeating-linear-gradient(#2b3354 0%, #266 40%, #266 60%, #2b3354 100%);
        background-size: 400% 400%;
        animation: gradient 60s linear infinite;
    }

    @keyframes gradient {
        0% {
            background-position: 0% 0%;
        }
        50% {
            background-position: 100% 100%;
        }
        100% {
            background-position: 0% 0%;
        }
    }
</style>
