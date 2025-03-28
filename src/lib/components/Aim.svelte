<script lang="ts">
    let { url, title, desc } = $props();
</script>

<div class="min-w-80 flex-1 rounded-lg bg-black bg-opacity-40 p-8">
    <img src={url} class="h-10" alt="{title} icon" />
    <div class="mt-4 text-xl font-bold uppercase">{title}</div>
    <p class="mt-4">{desc}</p>
</div>
