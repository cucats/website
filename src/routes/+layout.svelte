<script lang="ts">
    import Navigation from "$lib/components/Navigation.svelte";

    import "../app.css";
    import { AppBar, Drawer, initializeStores, getDrawerStore } from "@skeletonlabs/skeleton";

    initializeStores();

    // Highlight JS
    import hljs from "highlight.js/lib/core";
    import "highlight.js/styles/github-dark.css";
    import { storeHighlightJs } from "@skeletonlabs/skeleton";
    import xml from "highlight.js/lib/languages/xml"; // for HTML
    import css from "highlight.js/lib/languages/css";
    import javascript from "highlight.js/lib/languages/javascript";
    import typescript from "highlight.js/lib/languages/typescript";

    import Hamburger from "$lib/components/Hamburger.svelte";
    import { afterNavigate } from "$app/navigation";
    import { storePopup } from "@skeletonlabs/skeleton";
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";

    hljs.registerLanguage("xml", xml); // for HTML
    hljs.registerLanguage("css", css);
    hljs.registerLanguage("javascript", javascript);
    hljs.registerLanguage("typescript", typescript);
    storeHighlightJs.set(hljs);

    // Floating UI for Popups
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

    const drawerStore = getDrawerStore();

    afterNavigate(() => {
        drawerStore.close();
    });

    const launchNavigationSidebar = () => {
        drawerStore.open({
            id: "navigation",
        });
    };
</script>

<svelte:head>
    <title>CUCaTS</title>
</svelte:head>

<Drawer>
    {#if $drawerStore.id === "navigation"}
        <div class="flex flex-col gap-4 p-8 mt-12">
            <Navigation />
        </div>
    {/if}
</Drawer>

<!-- Background gradient overlay -->
<div class="bg-black opacity-60 fixed w-screen h-screen -z-50"></div>
<header class="sticky top-0 z-10">
    <AppBar>
        <svelte:fragment slot="lead">
            <a href="/" class="contents">
                <img
                    class="size-8 ml-4"
                    src="/logo/dark/logo-white-cat.svg"
                    alt="CUCaTS logo of a white cat in ASCII art"
                />
                <span class="px-2 mr-4">CUCaTS</span>
            </a>
        </svelte:fragment>
        <svelte:fragment slot="trail">
            <div class="hidden md:flex gap-4">
                <Navigation />
            </div>
            <button
                type="button"
                class="btn-icon md:hidden"
                on:click={launchNavigationSidebar}
                aria-label="Menu"
            >
                <Hamburger />
            </button>
        </svelte:fragment>
    </AppBar>
</header>
<!-- Page Route Content -->
<slot />
