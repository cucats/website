<script lang="ts">
    import type { EventData } from "data/events";

    interface Props {
        event: EventData;
    }

    let { event }: Props = $props();
</script>

<div class="event-card">
    <div class="title">{event.title}</div>

    {#if event.date}
        <div class="date">
            {event.date.map((d) => d.toDateString()).join(" – ")}
        </div>
    {/if}

    {#if event.description}
        <p>{event.description}</p>
    {/if}

    {#if event.website}
        <a href={event.website} class="variant-soft-primary btn">Website</a>
    {/if}

    {#if event.logo}
        <img src={event.logo} alt="{event.title} logo" />
    {/if}
</div>

<style lang="postcss">
    .event-card {
        @apply relative whitespace-pre-line rounded-lg bg-zinc-900 bg-opacity-60 p-8 md:mx-8 md:p-10;

        .title {
            @apply font-mono text-3xl font-bold tracking-tight sm:text-4xl;
        }

        .date {
            @apply uppercase text-gray-300;
        }

        p {
            @apply mt-4 whitespace-normal font-mono text-lg tracking-tighter text-gray-200;
        }

        a {
            @apply mt-2 font-bold;
        }

        img {
            @apply absolute right-0 top-0 -z-10 flex max-h-full opacity-10;
        }
    }
</style>
