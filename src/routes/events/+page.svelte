<script lang="ts">
    import { fade } from "svelte/transition";
    import Event from "../../components/Event.svelte";
    import events from "../../data/events.json";

    // Should still display on end date
    let today = new Date().setHours(0, 0, 0, 0);
</script>

<main class="p-4 flex flex-col gap-y-4 max-w-screen-lg mx-auto lg:pt-12" in:fade>
    <h1 class="text-5xl">Events</h1>

    {#each events as event}
        {#if !event.date || Date.parse(event.date[1]) >= today}
            <Event event={event} />
        {/if}
    {/each}

    Check our Discord for up-to-date information.

    <h2 class="my-4 text-4xl">Archive</h2>

    {#each events as event}
        {#if event.date && Date.parse(event.date[1]) < today}
            <Event event={event} />
        {/if}
    {/each}
</main>

