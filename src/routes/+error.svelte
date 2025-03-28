<script lang="ts">
    import { page } from "$app/stores";

    const { error, status } = $page;
</script>

<main
    class="absolute left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-4 lg:gap-0"
>
    <h1 class="text-4xl">{status}</h1>
    <h2 class="text-2xl">{error?.message}</h2>
</main>
