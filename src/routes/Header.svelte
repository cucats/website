<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import { searchState } from "$lib/search-state.svelte";

  let active = $state(false);

  const links = [
    { href: "/about", label: "About Us" },
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
    { href: "/wiki", label: "Wiki" },
    { href: "/sponsors", label: "Sponsors" },
  ];
</script>

<header class="absolute z-50 w-full">
  <div class="r-4 mx-auto h-24 max-w-7xl justify-between px-4">
    <!-- Logo -->
    <a href="/" class="r-4 items-center" onclick={() => (active = false)}>
      <enhanced:img
        class="size-10"
        src="$lib/assets/logo/dark/logo-white-cat.svg"
        alt="CUCaTS logo of a white cat in ASCII art"
      />
      <span class="px-2 text-2xl font-extrabold text-neutral-100">CUCaTS</span>
    </a>

    <!-- Navigation -->
    <nav
      class="hidden items-center gap-2 text-lg font-semibold text-neutral-100 uppercase sm:flex"
    >
      {#each links as link}
        <a
          class="p-3 transition duration-200 ease-in-out sm:hover:scale-105"
          href={link.href}
        >
          {link.label}
        </a>
      {/each}

      <!-- Search button -->
      <button
        onclick={() => searchState.open()}
        class="ml-2 flex items-center gap-2 rounded-lg bg-neutral-800/50 px-3 py-2 text-sm font-normal normal-case text-neutral-400 transition-colors hover:bg-neutral-700/50 hover:text-neutral-300"
        aria-label="Search"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="hidden lg:inline">Search</span>
        <kbd class="hidden rounded bg-neutral-700 px-1.5 py-0.5 text-xs lg:inline">Ctrl K</kbd>
      </button>
    </nav>

    <!-- Hamburger -->
    <button
      class="my-auto flex size-16 cursor-pointer flex-col justify-center gap-1 p-4 sm:hidden"
      aria-label="Toggle menu"
      onclick={() => (active = !active)}
    >
      <enhanced:img
        src="$lib/assets/icons/hamburger.png"
        class="pixel size-8"
        alt="Build connections"
      />
    </button>
  </div>
</header>

<!-- Mobile drawer -->
{#if active}
  <!-- Background overlay -->
  <div
    class="fixed inset-0 z-40 bg-black/50 sm:hidden"
    onclick={() => (active = false)}
    onkeydown={(e) => e.key === "Escape" && (active = false)}
    role="button"
    tabindex="0"
    aria-label="Close navigation menu"
    transition:fade={{ duration: 200 }}
  ></div>

  <!-- Drawer -->
  <div
    class="fixed top-0 right-0 z-50 h-full w-full bg-neutral-900 shadow-xl sm:hidden"
    role="dialog"
    aria-modal="true"
    aria-label="Navigation menu"
    transition:fly={{ x: 256, duration: 300 }}
  >
    <!-- Close button -->
    <button
      class="object-fit absolute top-0 right-0 m-4 size-16 cursor-pointer text-neutral-300 hover:text-neutral-100"
      onclick={() => (active = false)}
      aria-label="Close menu"
    >
      <CloseIcon class="m-auto h-8 w-8" />
    </button>

    <!-- Search button -->
    <button
      onclick={() => { active = false; searchState.open(); }}
      class="mx-6 mt-4 flex items-center gap-3 rounded-lg bg-neutral-800 px-4 py-3 text-neutral-400 transition-colors hover:bg-neutral-700"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span>Search...</span>
    </button>

    <!-- Navigation links -->
    <nav class="flex flex-col pt-4">
      {#each links as link}
        <a
          class="px-6 py-4 text-2xl font-semibold text-neutral-100 uppercase transition-colors hover:bg-neutral-800"
          href={link.href}
          onclick={() => (active = false)}
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </div>
{/if}
