<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { searchState } from "$lib/search-state.svelte";

  let active = $state(false);

  const links = [
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
    { href: "/wiki", label: "Wiki" },
    { href: "/sponsors", label: "Sponsors" },
    { href: "/committee", label: "Committee" },
  ];
</script>

<header class="fixed top-0 left-0 z-50 w-full bg-primary-900">
  <div class="r-4 mx-auto h-16 max-w-7xl justify-between px-4 font-saira">
    <!-- Logo -->
    <a
      href="/"
      class="r-4 h-full items-center px-4 transition-colors hover:bg-primary-800"
      onclick={() => (active = false)}
    >
      <enhanced:img
        class="size-10"
        src="$lib/assets/logo/dark/logo-white-cat.svg"
        alt="CUCaTS logo of a white cat in ASCII art"
      />
      <span class="text-2xl font-extrabold font-mono text-neutral-100"
        >CUCaTS</span
      >
    </a>

    <!-- Navigation -->
    <nav class="hidden text-xl font-medium text-neutral-100 md:flex">
      {#each links as link}
        <a
          class="flex h-full items-center px-4 transition-colors hover:bg-primary-800"
          href={link.href}
        >
          {link.label}
        </a>
      {/each}

      <!-- Search button -->
      <button
        onclick={() => searchState.open()}
        class="flex h-full cursor-pointer items-center gap-2 px-4 text-sm font-normal text-neutral-100 normal-case transition-colors hover:bg-primary-800"
        aria-label="Search"
      >
        <svg
          class="size-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.4"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </nav>

    <!-- Hamburger -->
    <button
      class="flex size-16 cursor-pointer flex-col items-center justify-center gap-1.5 transition-colors hover:bg-primary-800 md:hidden"
      aria-label={active ? "Close menu" : "Open menu"}
      onclick={() => (active = !active)}
    >
      <span
        class="h-0.5 w-6 rounded-full bg-neutral-100 transition-all duration-300 {active
          ? 'translate-y-2 rotate-45'
          : ''}"
      ></span>
      <span
        class="h-0.5 w-6 rounded-full bg-neutral-100 transition-all duration-300 {active
          ? 'opacity-0'
          : ''}"
      ></span>
      <span
        class="h-0.5 w-6 rounded-full bg-neutral-100 transition-all duration-300 {active
          ? '-translate-y-2 -rotate-45'
          : ''}"
      ></span>
    </button>
  </div>
</header>

<!-- Mobile drawer -->
{#if active}
  <!-- Background overlay -->
  <div
    class="fixed inset-0 z-40 bg-black/70 md:hidden"
    onclick={() => (active = false)}
    onkeydown={(e) => e.key === "Escape" && (active = false)}
    role="button"
    tabindex="0"
    aria-label="Close navigation menu"
    transition:fade={{ duration: 200 }}
  ></div>

  <!-- Drawer -->
  <div
    class="fixed top-16 right-0 bottom-0 z-45 w-full bg-primary-900 font-saira shadow-overlay md:hidden"
    role="dialog"
    aria-modal="true"
    aria-label="Navigation menu"
    transition:fly={{ y: -256, duration: 300 }}
  >
    <!-- Search button -->
    <div class="p-4">
      <button
        onclick={() => {
          active = false;
          searchState.open();
        }}
        class="flex w-full items-center gap-3 rounded-lg bg-primary-800 px-4 py-3 text-neutral-400 transition hover:brightness-125"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span>Search...</span>
      </button>
    </div>

    <!-- Navigation links -->
    <nav class="flex flex-col pt-4">
      {#each links as link}
        <a
          class="px-6 py-4 text-3xl font-medium text-neutral-100 transition-colors hover:bg-primary-800"
          href={link.href}
          onclick={() => (active = false)}
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </div>
{/if}
