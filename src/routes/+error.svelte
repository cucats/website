<script lang="ts">
    import { page } from "$app/stores";

    const { error, status } = $page;
</script>

<main
    class="flex items-center justify-center absolute w-screen h-screen left-0 top-0 flex-col gap-4 lg:gap-0"
>
    <h1 class="text-4xl">{status}</h1>
    <h2 class="text-2xl">{error?.message}</h2>
</main>
