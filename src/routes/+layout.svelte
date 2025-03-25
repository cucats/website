<script lang="ts">
    import Navigation from "$lib/components/Navigation.svelte";
    import Hamburger from "$lib/components/Hamburger.svelte";
    import "../app.css";

    let { children } = $props();

    let active = $state(false);

    function toggle() {
        active = !active;
    }
</script>

<svelte:head>
    <title>CUCaTS</title>
</svelte:head>

<!-- Background gradient overlay -->
<div
    class="variant-gradient-primary-secondary fixed -z-50 h-screen w-screen bg-gradient-to-r"
></div>
<div class="fixed -z-40 h-screen w-screen bg-black opacity-60"></div>

<!-- Navbar -->
<header class="fixed z-10 max-h-16 w-screen overflow-hidden duration-100 ease-out" class:w={active}>
    <div class="mx-auto bg-black bg-opacity-50 backdrop-blur-xl">
        <div class="relative flex h-16 items-center">
            <Hamburger bind:active />

            <!-- Logo -->
            <a href="/" class="contents" onclick={toggle}>
                <img
                    class="ml-8 size-8"
                    src="/logo/dark/logo-white-cat.svg"
                    alt="CUCaTS logo of a white cat in ASCII art"
                />
                <span class="px-2 text-2xl">CUCaTS</span>
            </a>

            <!-- Links -->
            <div class="ml-auto mr-16 hidden sm:block">
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

<!-- Push content downwards -->
<div class="h-16"></div>

{@render children()}

<style lang="postcss">
    .w {
        @apply max-h-72 duration-200;
    }
</style>
