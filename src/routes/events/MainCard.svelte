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
  class={[
    "relative h-90 w-80 min-w-70 overflow-hidden rounded-lg bg-neutral-900",
    className,
  ]}
>
  <a href={website}>
    <div
      class="absolute z-50 size-full bg-neutral-950/50 opacity-0 backdrop-blur-lg duration-200 hover:opacity-100"
    >
      <p class="flex size-full items-center justify-center text-lg font-bold">
        Visit website -&gt;
      </p>
    </div>
  </a>

  <div class="bg-primary-800 h-60">
    {#if picture}
      <img
        class="h-60 w-full object-cover"
        src={picture}
        alt={title}
        aria-hidden="true"
      />
    {/if}
  </div>

  <div class="p-4">
    <h3 class="text-xl font-bold text-neutral-200">
      {title}
    </h3>
    {#if subtitle}
      <p class="p">
        {subtitle}
      </p>
    {/if}
  </div>
</div>
