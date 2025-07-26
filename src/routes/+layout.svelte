<script lang="ts">
    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";
    import "../app.css";
    import { fade } from "svelte/transition";

    let { data, children } = $props();
</script>

<svelte:head>
    <title>CUCaTS</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
    <Header />

    {#key data.pathname}
        {@render children()}
    {/key}
    <Footer />
</div>
