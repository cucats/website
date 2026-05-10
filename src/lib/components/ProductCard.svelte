<script lang="ts">
  interface Props {
    name: string;
    href: string;
    image?: string | null;
    priceLabel?: string;
    class?: string;
  }

  let {
    name,
    href,
    image,
    priceLabel,
    class: className = "",
  }: Props = $props();
</script>

<a
  {href}
  class="group bg-primary-950/40 border-primary-800/60 block overflow-hidden rounded-lg border transition-colors hover:bg-primary-900 {className}"
>
  <div class="bg-primary-900 aspect-square overflow-hidden">
    {#if image}
      <img
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        src={image}
        alt={name}
      />
    {/if}
  </div>
  <div class="p-3">
    <div class="truncate text-sm font-semibold text-neutral-100">{name}</div>
    {#if priceLabel}
      <div class="mt-0.5 text-xs text-neutral-400">{priceLabel}</div>
    {/if}
  </div>
</a>
