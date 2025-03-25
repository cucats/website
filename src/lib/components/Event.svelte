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
            @apply text-3xl font-black sm:text-4xl;
        }

        .date {
            @apply uppercase;
        }

        p {
            @apply font-sans text-xl mt-6 whitespace-normal text-gray-300;
        }

        a {
            @apply mt-4 font-bold;
        }

        img {
            @apply absolute right-0 top-0 -z-10 flex max-h-full opacity-10;
        }
    }
</style>
