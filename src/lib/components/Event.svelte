<script>
    export let event;
</script>

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

<style lang="postcss">
    .event-card {
        @apply bg-opacity-60 bg-zinc-900 whitespace-pre-line p-8 md:p-10 md:mx-8 rounded-lg relative text-center md:text-justify;

        .title {
            @apply text-4xl font-bold;
        }

        .date {
            @apply uppercase;
        }

        p {
            @apply mt-4 text-gray-100 whitespace-normal;
        }

        a {
            @apply mt-4;
        }

        img {
            @apply max-h-full flex absolute right-0 top-0 opacity-10 -z-10;
        }
    }
</style>
