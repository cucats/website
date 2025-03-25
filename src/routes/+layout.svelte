<script lang="ts">
    import Navigation from "$lib/components/Navigation.svelte";
    import Hamburger from "$lib/components/Hamburger.svelte";
    import "../app.css";

    let { children } = $props();

    let visible = $state(false);

    function toggle() {
        visible = !visible;
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
<header class="fixed z-10 w-screen">
    <div class="mx-auto bg-black bg-opacity-50 backdrop-blur-xl">
        <div class="relative flex h-16 items-center">
            <!-- Logo -->
            <a href="/" class="contents">
                <img
                    class="ml-8 size-8"
                    src="/logo/dark/logo-white-cat.svg"
                    alt="CUCaTS logo of a white cat in ASCII art"
                />
                <span class="px-2 text-2xl">CUCaTS</span>
            </a>

            <Hamburger bind:active={visible} />

            <!-- Links -->
            <div class="ml-auto mr-16 hidden sm:block">
                <div class="flex">
                    <Navigation />
                </div>
            </div>
        </div>

        {#if visible}
            <!-- Mobile drawer -->
            <div id="mobile-menu" class="h-screen sm:hidden">
                <Navigation bind:toggle={visible} />
            </div>
        {/if}
    </div>
</header>

<!-- Push content downwards -->
<div class="h-16"></div>

{@render children()}
