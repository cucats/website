<script lang="ts">
    export let name: string;
    export let role: string;
</script>

<div class="">
    <div class="text-center text-sm sm:text-base">
        <span class="mr-2 block font-bold lowercase sm:inline">{role}</span><span
            class="inline text-gray-300 opacity-60">@cucats.org</span
        >
    </div>
    <div class="text-center text-xl font-medium sm:text-3xl">{name}</div>
</div>
