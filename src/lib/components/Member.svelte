<script lang="ts">
    export let name: string;
    export let role: string;
</script>

<div class="min-w-40 sm:min-w-64">
    <div class="text-sm sm:text-base">
        <span class="mr-2 block font-bold lowercase sm:inline">{role}</span><span
            class="inline text-gray-300 opacity-60">@cucats.org</span
        >
    </div>
    <div class="text-xl font-medium tracking-tight sm:text-3xl">{name}</div>
</div>
