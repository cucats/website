<script lang="ts">
    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";
    import "../app.css";

    let { children } = $props();
</script>

<svelte:head>
    <title>CUCaTS</title>
</svelte:head>

<!-- Background gradient overlay -->
<div class="background"></div>

<div class="flex min-h-screen flex-col">
    <Header />
    <div class="flex-grow">
        {@render children()}
    </div>
    <Footer />
</div>

<style lang="postcss">
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
