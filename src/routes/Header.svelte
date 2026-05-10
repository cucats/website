<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { page } from "$app/state";
  import { signIn, signOut } from "@auth/sveltekit/client";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import { searchState } from "$lib/search-state.svelte";
  import { cart } from "$lib/cart.svelte";

  let active = $state(false);
  let userMenuOpen = $state(false);

  function closeOnOutsideClick(node: HTMLElement) {
    function handle(e: MouseEvent) {
      if (!node.contains(e.target as Node)) userMenuOpen = false;
    }
    document.addEventListener("click", handle, true);
    return {
      destroy() {
        document.removeEventListener("click", handle, true);
      },
    };
  }

  const links = [
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
    { href: "/wiki", label: "Wiki" },
    { href: "/sponsors", label: "Sponsors" },
    { href: "/committee", label: "Committee" },
    { href: "/shop", label: "Shop" },
  ];
</script>

<header class="absolute z-50 w-full">
  <div class="r-4 mx-auto h-24 max-w-7xl justify-between px-4">
    <!-- Logo -->
    <a href="/" class="r-4 items-center" onclick={() => (active = false)}>
      <enhanced:img
        class="ml-2 size-10"
        src="$lib/assets/logo/dark/logo-white-cat.svg"
        alt="CUCaTS logo of a white cat in ASCII art"
      />
      <span class="px-2 text-2xl font-extrabold text-neutral-100">CUCaTS</span>
    </a>

    <!-- Navigation -->
    <nav
      class="hidden items-center gap-2 text-lg font-semibold text-neutral-100 uppercase md:flex"
    >
      {#each links as link}
        <a
          class="p-3 transition duration-200 ease-in-out md:hover:scale-105"
          href={link.href}
        >
          {link.label}
        </a>
      {/each}

      <!-- Search button -->
      <button
        onclick={() => searchState.open()}
        class="my-auto ml-2 flex cursor-pointer items-center gap-2 rounded-lg bg-neutral-950/50 px-3 py-2 text-sm font-normal text-neutral-100 normal-case transition-colors hover:bg-neutral-800/50"
        aria-label="Search"
      >
        <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <kbd class="hidden rounded bg-neutral-700 px-1.5 py-0.5 text-xs lg:inline">
          Ctrl K
        </kbd>
      </button>

      {#if page.data.session?.user}
        <!-- Basket icon -->
        <a
          href="/shop/cart"
          class="relative my-auto flex cursor-pointer items-center rounded-lg bg-neutral-950/50 p-2 text-neutral-100 transition-colors hover:bg-neutral-800/50"
          aria-label="Basket"
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
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1.5 11.5a1 1 0 01-1 .9H7.5a1 1 0 01-1-.9L5 9z"
            />
          </svg>
          {#if cart.count > 0}
            <span
              class="bg-primary-500 absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs font-bold text-neutral-100"
            >
              {cart.count}
            </span>
          {/if}
        </a>

        <!-- User dropdown -->
        <div class="relative my-auto" use:closeOnOutsideClick>
          <button
            class="r-2 cursor-pointer items-center rounded-lg bg-neutral-950/50 px-3 py-2 text-sm font-normal text-neutral-100 normal-case transition-colors hover:bg-neutral-800/50"
            onclick={() => (userMenuOpen = !userMenuOpen)}
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
          >
            <span>{page.data.session.user.email?.split("@")[0] ?? ""}</span>
            <svg
              class="size-3 transition-transform"
              class:rotate-180={userMenuOpen}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {#if userMenuOpen}
            <div
              class="absolute right-0 mt-1 w-44 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 text-sm text-neutral-100 shadow-xl"
              role="menu"
              transition:fade={{ duration: 100 }}
            >
              <a
                href="/shop/orders"
                class="block px-4 py-2 hover:bg-neutral-800"
                role="menuitem"
                onclick={() => (userMenuOpen = false)}
              >
                Your orders
              </a>
              {#if page.data.session.user.isAdmin}
                <a
                  href="/admin"
                  class="block px-4 py-2 hover:bg-neutral-800"
                  role="menuitem"
                  onclick={() => (userMenuOpen = false)}
                >
                  Admin
                </a>
              {/if}
              <button
                class="block w-full cursor-pointer border-t border-neutral-800 px-4 py-2 text-left hover:bg-neutral-800"
                role="menuitem"
                onclick={() => {
                  userMenuOpen = false;
                  signOut();
                }}
              >
                Sign out
              </button>
            </div>
          {/if}
        </div>
      {:else}
        <button
          class="bg-primary-600 hover:bg-primary-500 my-auto ml-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-normal text-neutral-100 normal-case transition-colors"
          onclick={() => signIn("keycloak")}
        >
          Sign in
        </button>
      {/if}
    </nav>

    <!-- Hamburger -->
    <button
      class="my-auto flex size-16 cursor-pointer flex-col justify-center gap-1 p-4 md:hidden"
      aria-label="Toggle menu"
      onclick={() => (active = !active)}
    >
      <enhanced:img
        src="$lib/assets/icons/hamburger.png"
        class="pixel size-8"
        alt="Hamburger icon"
      />
    </button>
  </div>
</header>

<!-- Mobile drawer -->
{#if active}
  <!-- Background overlay -->
  <div
    class="fixed inset-0 z-40 bg-black/50 md:hidden"
    onclick={() => (active = false)}
    onkeydown={(e) => e.key === "Escape" && (active = false)}
    role="button"
    tabindex="0"
    aria-label="Close navigation menu"
    transition:fade={{ duration: 200 }}
  ></div>

  <!-- Drawer -->
  <div
    class="fixed top-0 right-0 z-50 h-full w-full bg-neutral-900 shadow-xl md:hidden"
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
      onclick={() => {
        active = false;
        searchState.open();
      }}
      class="mx-6 mt-4 flex cursor-pointer items-center gap-3 rounded-lg bg-neutral-800 px-4 py-3 text-neutral-400 transition-colors hover:bg-neutral-700"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span>Search...</span>
    </button>

    <!-- Navigation links -->
    <nav class="flex flex-col pt-4">
      {#each links as link}
        <a
          class="cursor-pointer px-6 py-4 text-left text-2xl font-semibold text-neutral-100 uppercase transition-colors hover:bg-neutral-800"
          href={link.href}
          onclick={() => (active = false)}
        >
          {link.label}
        </a>
      {/each}

      {#if page.data.session?.user}
        <a
          class="cursor-pointer px-6 py-4 text-left text-2xl font-semibold text-neutral-100 uppercase transition-colors hover:bg-neutral-800"
          href="/shop/cart"
          onclick={() => (active = false)}
        >
          Basket{#if cart.count > 0}&nbsp;({cart.count}){/if}
        </a>
        <a
          class="cursor-pointer px-6 py-4 text-left text-2xl font-semibold text-neutral-100 uppercase transition-colors hover:bg-neutral-800"
          href="/shop/orders"
          onclick={() => (active = false)}
        >
          Your orders
        </a>
        {#if page.data.session.user.isAdmin}
          <a
            class="cursor-pointer px-6 py-4 text-left text-2xl font-semibold text-neutral-100 uppercase transition-colors hover:bg-neutral-800"
            href="/admin"
            onclick={() => (active = false)}
          >
            Admin
          </a>
        {/if}
        <span
          class="px-6 py-4 text-left text-sm font-medium text-neutral-400 normal-case"
        >
          {page.data.session.user.email?.split("@")[0] ?? ""}
        </span>
        <button
          class="cursor-pointer px-6 py-4 text-left text-2xl font-semibold text-neutral-100 uppercase transition-colors hover:bg-neutral-800"
          onclick={() => {
            active = false;
            signOut();
          }}
        >
          Sign out
        </button>
      {:else}
        <button
          class="cursor-pointer px-6 py-4 text-left text-2xl font-semibold text-neutral-100 uppercase transition-colors hover:bg-neutral-800"
          onclick={() => {
            active = false;
            signIn("keycloak");
          }}
        >
          Sign in
        </button>
      {/if}
    </nav>
  </div>
{/if}
