<script lang="ts">
  interface Props {
    name: string;
    href: string;
    description?: string | null;
    image?: string | null;
    priceLabel?: string;
    class?: string;
  }

  let {
    name,
    href,
    description,
    image,
    priceLabel,
    class: className = "",
  }: Props = $props();
</script>

<a
  {href}
  class="group relative block h-80 w-76 min-w-76 overflow-hidden rounded-lg bg-neutral-900 duration-300 hover:scale-105 {className}"
>
  <div class="bg-primary-900 h-full">
    {#if image}
      <img
        class="h-full w-full object-cover duration-200"
        src={image}
        alt={name}
        aria-hidden="true"
      />
    {/if}
  </div>
  <div
    class="absolute inset-0 bg-linear-to-b from-transparent to-black/80 duration-300 group-hover:bg-black/50 group-hover:backdrop-blur-lg"
  >
    <div
      class="absolute inset-0 flex items-center justify-center font-bold opacity-0 duration-300 group-hover:opacity-100"
    >
      View {name} →
    </div>
    <div class="absolute bottom-0 w-full p-4">
      <div class="text-2xl font-bold text-white">{name}</div>
      {#if priceLabel}
        <div class="text-sm text-neutral-300">{priceLabel}</div>
      {/if}
      {#if description}
        <div class="mt-1 line-clamp-2 text-sm text-neutral-400">{description}</div>
      {/if}
    </div>
  </div>
</a>
