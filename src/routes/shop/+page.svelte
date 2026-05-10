<script lang="ts">
  import { page } from "$app/state";
  import { signIn } from "@auth/sveltekit/client";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const session = $derived(page.data.session);

  function dateRange(opens: Date | string | null, closes: Date | string | null): string {
    if (!opens || !closes) return "";
    const o = new Date(opens);
    const c = new Date(closes);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    return `${fmt(o)} – ${fmt(c)}`;
  }
</script>

<section class="from-primary-700 via-secondary-800 to-tertiary-800 bg-linear-to-br pt-32 pb-16">
  <div class="mx-auto max-w-7xl px-4">
    <h1 class="h1 text-neutral-100">Shop</h1>
  </div>
</section>

{#if !session?.user}
  <section class="flex flex-1 items-center justify-center bg-neutral-950 py-16">
    <button class="btn primary md" onclick={() => signIn("keycloak")}>
      Sign in
    </button>
  </section>
{:else}
  <section class="bg-primary-900 py-16">
    <div class="mx-auto max-w-7xl px-4">
      <h2 class="h2 mb-6 text-neutral-100">Open now</h2>
      {#if data.openShowcases.length === 0}
        <p class="p text-neutral-400">Nothing is open for orders right now.</p>
      {:else}
        <ul class="c-4">
          {#each data.openShowcases as s}
            <li class="bg-primary-950/40 border-primary-800/60 r-4 items-center justify-between rounded-lg border p-5">
              <div>
                <h3 class="h4 text-neutral-100">{s.name}</h3>
                {#if s.description}
                  <p class="p mt-2 max-w-2xl text-neutral-400">{s.description}</p>
                {/if}
                <p class="mt-2 text-sm text-neutral-400">
                  {#if s.kind === "drop"}
                    {dateRange(s.opens_at, s.closes_at)}
                    {#if s.collection_event}
                      ・ Collection: {s.collection_event}
                    {/if}
                  {:else}
                    Ships direct to you
                  {/if}
                </p>
              </div>
              <a class="btn primary md" href="/shop/showcases/{s.slug}">
                {s.kind === "drop" ? "Shop drop" : "Browse"}
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </section>

  {#if data.pastDrops.length > 0}
    <section class="bg-primary-800 py-16">
      <div class="mx-auto max-w-7xl px-4">
        <h2 class="h2 mb-6 text-neutral-100">Past drops</h2>
        <ul class="c-2 divide-y divide-neutral-800">
          {#each data.pastDrops as d}
            <li class="r-4 items-center justify-between py-3">
              <div>
                <p class="font-medium text-neutral-100">{d.name}</p>
                <p class="text-sm text-neutral-400">
                  {dateRange(d.opens_at, d.closes_at)} ・ {d.status}
                </p>
              </div>
              <a class="btn neutral sm" href="/shop/showcases/{d.slug}">View</a>
            </li>
          {/each}
        </ul>
      </div>
    </section>
  {/if}
{/if}
