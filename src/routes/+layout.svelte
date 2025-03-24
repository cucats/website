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
<div class="bg-black opacity-60 fixed w-screen h-screen -z-50"></div>

<!-- Navbar -->
<header class="fixed z-10 w-screen backdrop-blur-2xl bg-black bg-opacity-30">
    <div class="relative flex h-16 items-center">
        <!-- Logo -->
        <a href="/" class="contents">
            <img
                class="size-8 ml-8"
                src="/logo/dark/logo-white-cat.svg"
                alt="CUCaTS logo of a white cat in ASCII art"
            />
            <span class="px-2 text-lg">CUCaTS</span>
        </a>

        <!-- Hamburger -->
        <button
            class="absolute right-0 flex items-center sm:hidden px-8"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onclick={() => (visible = !visible)}
        >
            <Hamburger />
        </button>

        <!-- Links -->
        <div class="hidden sm:block ml-auto mr-16">
            <div class="flex">
                <Navigation />
            </div>
        </div>
    </div>

    <!-- Mobile drawer -->
    {#if visible}
        <div class="sm:hidden h-screen">
            <Navigation />
        </div>
    {/if}
</header>

<!-- Push content downwards -->
<div class="h-16"></div>

{@render children()}
