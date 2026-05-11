<script lang="ts">
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
  import SearchModal from "$lib/components/SearchModal.svelte";
  import Toasts from "$lib/components/Toasts.svelte";
  import "../app.css";

  let { data, children } = $props();
</script>

<div class="flex min-h-screen flex-col">
  <Header />

  <main class="flex flex-1 flex-col">
    {#key data.pathname}
      {@render children()}
    {/key}
  </main>

  <Footer />
</div>

<SearchModal />
<Toasts />
