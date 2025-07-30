<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title: Snippet;
    date?: Snippet;
    description?: Snippet;
    website?: string;
    logo?: string;
    class?: string;
  }

  let {
    title,
    date,
    description,
    website,
    logo,
    class: className = "",
  }: Props = $props();
</script>

<article class={["clearfix rounded-lg bg-neutral-800/50 p-4", className]}>
  {#if logo}
    <img
      class="float-right mb-4 ml-4 h-auto max-w-48"
      src={logo}
      alt=""
      aria-hidden="true"
    />
  {/if}

  <div class="c-4">
    <h3 class="text-2xl font-bold md:text-3xl">
      {@render title()}
    </h3>

    {#if date}
      <div class="text-sm tracking-wider text-neutral-300 uppercase">
        {@render date()}
      </div>
    {/if}

    {#if description}
      <div class="text-lg leading-relaxed tracking-tight text-neutral-300">
        {@render description()}
      </div>
    {/if}

    {#if website}
      <div>
        <a
          href={website}
          class="btn primary md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Website →
        </a>
      </div>
    {/if}
  </div>
</article>
