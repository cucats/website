<script lang="ts">
    import Navigation from "$lib/components/Navigation.svelte";
    import Hamburger from "$lib/components/Hamburger.svelte";
    import {
        AppBar,
        Drawer,
        getDrawerStore,
        initializeStores,
        storePopup,
    } from "@skeletonlabs/skeleton";
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
    import { afterNavigate } from "$app/navigation";
    import type { Snippet } from "svelte";
    import "../app.css";

    initializeStores();
    // Floating UI for Popups
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
    const drawerStore = getDrawerStore();
    afterNavigate(drawerStore.close);
    const launchNavigationSidebar = () => drawerStore.open({ id: "navigation" });

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
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
        {#snippet lead()}
            <a href="/" class="contents">
                <img
                    class="size-8 ml-4"
                    src="/logo/dark/logo-white-cat.svg"
                    alt="CUCaTS logo of a white cat in ASCII art"
                />
                <span class="px-2 mr-4">CUCaTS</span>
            </a>
        {/snippet}
        {#snippet trail()}
            <div class="hidden md:flex gap-4">
                <Navigation />
            </div>
            <button
                type="button"
                class="btn-icon md:hidden"
                onclick={launchNavigationSidebar}
                aria-label="Menu"
            >
                <Hamburger />
            </button>
        {/snippet}
    </AppBar>
</header>

{@render children()}
