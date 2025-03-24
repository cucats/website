<script lang="ts">
    import Navigation from "$lib/components/Navigation.svelte";
    import Hamburger from "$lib/components/Hamburger.svelte";
    import "../app.css";

    let { children } = $props();
    let visible = $state(false);
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
<header class="fixed z-10 w-screen bg-black bg-opacity-50 backdrop-blur-xl">
    <div class="relative flex h-16 items-center">
        <!-- Logo -->
        <a href="/" class="contents">
            <img
                class="ml-8 size-8"
                src="/logo/dark/logo-white-cat.svg"
                alt="CUCaTS logo of a white cat in ASCII art"
            />
            <span class="px-2 text-lg">CUCaTS</span>
        </a>

        <!-- Hamburger -->
        <button
            class="absolute right-0 flex items-center px-8 sm:hidden"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onclick={() => (visible = !visible)}
        >
            <Hamburger />
        </button>

        <!-- Links -->
        <div class="ml-auto mr-16 hidden sm:block">
            <div class="flex">
                <Navigation />
            </div>
        </div>
    </div>

    <!-- Mobile drawer -->
    {#if visible}
        <div class="h-screen sm:hidden">
            <Navigation />
        </div>
    {/if}
</header>

<!-- Push content downwards -->
<div class="h-16"></div>

{@render children()}
