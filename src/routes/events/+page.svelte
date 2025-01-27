<script lang="ts">
    import { fade } from "svelte/transition";
    import events from "../../data/events.json";
    let now = new Date().getTime();
</script>

<main class="p-4 flex flex-col gap-y-4 max-w-screen-lg mx-auto lg:pt-12" in:fade>
    <h1 class="text-5xl">Events</h1>

    {#each events as event}
        {#if !event.date || Date.parse(event.date[1]) > now}
            <div class="event-card">
                <div class="title">{event.title}</div>

                {#if event.date}
                    <div class="date">{event.date[0]} &ndash; {event.date[1]}</div>
                {/if}

                {#if event.description}
                    <p>{event.description}</p>
                {/if}

                {#if event.website}
                    <a href={event.website} class="btn variant-soft-primary">Website</a>
                {/if}

                {#if event.logo}
                    <img src={event.logo} alt="{event.title} logo" />
                {/if}
            </div>
        {/if}
    {/each}

    Check our Discord for up-to-date information.

    <h2 class="my-4 text-4xl">Archive</h2>

    {#each events as event}
        {#if event.date && Date.parse(event.date[1]) <= now}
            <div class="event-card">
                <div class="title">{event.title}</div>

                {#if event.date}
                    <div class="date">{event.date[0]} &ndash; {event.date[1]}</div>
                {/if}

                {#if event.description}
                    <p>{event.description}</p>
                {/if}

                {#if event.website}
                    <a href={event.website} class="btn variant-soft-primary">Website</a>
                {/if}

                {#if event.logo}
                    <img src={event.logo} alt="{event.title} logo" />
                {/if}
            </div>
        {/if}
    {/each}
</main>

<style lang="postcss">
    .event-card {
        @apply bg-opacity-60 bg-zinc-900 whitespace-pre-line p-8 md:p-10 md:mx-8 rounded-lg relative text-center md:text-justify;
    }

    .title {
        @apply text-4xl font-bold;
    }

    .date {
        @apply uppercase;
    }

    .event-card p {
        @apply mt-4 text-gray-100 whitespace-normal;
    }

    .event-card a {
        @apply mt-4;
    }

    .event-card img {
        @apply max-h-full flex absolute right-0 top-0 opacity-10 -z-10;
    }
</style>
