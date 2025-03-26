<script lang="ts">
    export let name: string;
    export let role: string;
</script>

<div class="">
    <div class="text-center text-sm sm:text-base">
        <div class="mr-2 font-bold lowercase sm:inline">{role}</div>
        <div class="inline text-gray-300 opacity-60">@cucats.org</div>
    </div>
    <div class="text-center text-xl font-medium sm:text-3xl">{name}</div>
</div>
