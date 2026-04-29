<script lang="ts">
  interface Props {
    title: string;
    website: string;
    subtitle?: string;
    picture?: string;
    class?: string;
  }

  let {
    title,
    website,
    subtitle,
    picture,
    class: className = "",
  }: Props = $props();
</script>

<div
  class="group relative h-80 w-76 min-w-76 overflow-hidden rounded-lg bg-neutral-900 select-none {className} duration-300 hover:scale-105"
>
  <a href={website}>
    <div
      class="absolute z-10 size-full bg-linear-to-b from-transparent to-black/80 opacity-100 duration-300 group-hover:bg-black/50 group-hover:backdrop-blur-lg"
    >
      <div
        class="absolute flex h-full w-full items-center justify-center font-bold opacity-0 duration-300 group-hover:opacity-100"
      >
        Visit {title} -&gt;
      </div>

      <div class="absolute bottom-0 p-4">
        <div class="text-2xl font-bold text-white">
          {title}
        </div>

        <div>
          {subtitle}
        </div>
      </div>
    </div>
  </a>

  <div class="bg-primary-800 h-full">
    {#if picture}
      <img
        class="h-full w-full object-cover duration-200"
        src={picture}
        alt={title}
        aria-hidden="true"
      />
    {/if}
  </div>
</div>
