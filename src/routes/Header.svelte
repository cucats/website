<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";

  let active = $state(false);

  const links = [
    { href: "/about", label: "About Us" },
    { href: "/events", label: "Events" },
    { href: "/sponsors", label: "Sponsors" },
  ];
</script>

<header class="absolute z-50 w-full">
  <div class="r-4 mx-auto h-24 max-w-7xl justify-between px-4">
    <!-- Logo -->
    <a href="/" class="r-4 items-center" onclick={() => (active = false)}>
      <img
        class="size-10"
        src="/assets/logo/dark/logo-white-cat.svg"
        alt="CUCaTS logo of a white cat in ASCII art"
      />
      <span class="px-2 text-2xl font-extrabold text-neutral-100">CUCaTS</span>
    </a>

    <!-- Navigation -->
    <nav
      class="hidden items-center gap-4 text-lg font-semibold text-neutral-100 uppercase sm:flex"
    >
      {#each links as link}
        <a
          class="p-4 transition duration-200 ease-in-out sm:hover:scale-105"
          href={link.href}
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <!-- Hamburger -->
    <button
      class="my-auto flex size-16 cursor-pointer flex-col justify-center gap-1 p-4 sm:hidden"
      aria-label="Toggle menu"
      onclick={() => (active = !active)}
    >
      <img
        src="/assets/icons/hamburger.png"
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
    class="fixed top-0 right-0 z-50 h-full w-64 bg-neutral-900 shadow-xl sm:hidden"
    role="dialog"
    aria-modal="true"
    aria-label="Navigation menu"
    transition:fly={{ x: 256, duration: 300 }}
  >
    <!-- Close button -->
    <button
      class="absolute top-4 right-4 cursor-pointer p-2 text-neutral-300 hover:text-neutral-100"
      onclick={() => (active = false)}
      aria-label="Close menu"
    >
      <CloseIcon />
    </button>

    <!-- Navigation links -->
    <nav class="flex flex-col pt-20">
      {#each links as link}
        <a
          class="px-6 py-4 text-lg font-semibold text-neutral-100 uppercase transition-colors hover:bg-neutral-800"
          href={link.href}
          onclick={() => (active = false)}
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </div>
{/if}
