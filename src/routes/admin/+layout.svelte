<script lang="ts">
  import { page } from "$app/state";
  let { children } = $props();

  const tabs = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/showcases", label: "Showcases" },
    { href: "/admin/orders", label: "Orders" },
  ];
</script>

<div class="mx-auto w-full max-w-screen-2xl flex-1 px-6 pt-32 pb-16">
  <nav class="r-4 mb-8 border-b border-neutral-800 pb-3 text-sm">
    {#each tabs as tab}
      <a
        href={tab.href}
        class="px-2 py-1 transition-colors hover:text-neutral-100"
        class:text-neutral-100={page.url.pathname === tab.href ||
          (tab.href !== "/admin" && page.url.pathname.startsWith(tab.href))}
        class:text-neutral-400={!(
          page.url.pathname === tab.href ||
          (tab.href !== "/admin" && page.url.pathname.startsWith(tab.href))
        )}
      >
        {tab.label}
      </a>
    {/each}
  </nav>
  {@render children()}
</div>
