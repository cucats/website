<script lang="ts">
    import { fade } from "svelte/transition";
    import Event from "$lib/components/Event.svelte";
    import events from "../../data/events.json";

    // Should still display on end date
    let today = new Date().setHours(0, 0, 0, 0);
</script>

<main class="mx-auto flex max-w-screen-lg flex-col gap-y-4 p-4 lg:pt-12" in:fade>
    <h1>Events</h1>

    {#each events as event}
        {#if !event.date || Date.parse(event.date[1]) >= today}
            <Event {event} />
        {/if}
    {/each}

    Check our Discord for up-to-date information.

    <h2 class="mt-8">Archive</h2>

    {#each events as event}
        {#if event.date && Date.parse(event.date[1]) < today}
            <Event {event} />
        {/if}
    {/each}
</main>
