<script lang="ts">
    import { fade } from "svelte/transition";
    import Event from "./Event.svelte";
    import { events } from "./events";

    // Should still display on end date
    let today = new Date();
    today.setHours(0, 0, 0, 0);
</script>

<main class="main" in:fade>
    <h1>Events</h1>

    <div class="events-grid">
        {#each events as event}
            {#if event.date[event.date.length - 1] >= today}
                <Event {event} class="mb-6 md:mx-8" />
            {/if}
        {/each}
    </div>

    <p>Check our private Discord for up-to-date information.</p>

    <h2 class="mt-8">Archive</h2>

    <div class="events-grid">
        {#each events as event}
            {#if event.date[event.date.length - 1] < today}
                <Event {event} class="mb-6 md:mx-8" compact />
            {/if}
        {/each}
    </div>
</main>
