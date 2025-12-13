<script lang="ts">
  interface Props {
    title: string;
    website: string;
    picture?: string;
    class?: string;
  }

  let { title, website, picture, class: className = "" }: Props = $props();
</script>

<div
  class={[
    "bg-tertiary-900 relative h-90 w-80 min-w-70 overflow-hidden rounded-lg",
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

  <div class="bg-tertiary-800 h-60">
    {#if picture}
      <img
        class="h-60 w-full object-cover duration-200"
        src={picture}
        alt=""
        aria-hidden="true"
      />
    {/if}
  </div>

  <div class="p-4">
    <h3 class="text-xl font-bold text-neutral-300">
      {title}
    </h3>
  </div>
</div>
