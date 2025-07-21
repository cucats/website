<script lang="ts">
    import type { EventData } from "./events";

    interface Props {
        event: EventData;
        showLogo?: boolean;
        compact?: boolean;
        class?: string;
    }

    let { event, showLogo = true, compact = false, class: className = '' }: Props = $props();

    function formatDateRange(dates: Date[]): string {
        if (dates.length === 0) return '';
        if (dates.length === 1) return dates[0].toDateString();
        
        const start = dates[0];
        const end = dates[dates.length - 1];
        
        if (start.toDateString() === end.toDateString()) {
            return start.toDateString();
        }
        
        return `${start.toDateString()} – ${end.toDateString()}`;
    }
</script>

<article class="event-card {compact ? 'compact' : ''} {className}">
    {#if showLogo && event.logo}
        <div class="event-logo-watermark">
            <img src={event.logo} alt="" aria-hidden="true" />
        </div>
    {/if}
    
    <header>
        <h3 class="event-title">{event.title}</h3>
        
        {#if event.date && event.date.length > 0}
            <time class="event-date" datetime={event.date[0].toISOString()}>
                {formatDateRange(event.date)}
            </time>
        {/if}
    </header>

    {#if event.description && !compact}
        <div class="event-description">
            <p>{event.description}</p>
        </div>
    {/if}

    {#if event.website}
        <footer class="event-actions">
            <a 
                href={event.website} 
                class="variant-soft-primary btn"
                target="_blank"
                rel="noopener noreferrer"
            >
                Visit Website →
            </a>
        </footer>
    {/if}
</article>

<style lang="postcss">
    .event-card {
        @apply relative overflow-hidden rounded-lg bg-zinc-900 bg-opacity-60 p-8 md:p-10;
        @apply transition-transform hover:scale-[1.02];
    }

    .event-card.compact {
        @apply p-6 md:p-6;
    }

    .event-logo-watermark {
        @apply absolute inset-0 -z-10 flex items-center justify-end p-8;
        
        img {
            @apply h-full max-h-48 w-auto opacity-10;
            mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
        }
    }

    header {
        @apply space-y-2;
    }

    .event-title {
        @apply font-mono text-3xl font-bold tracking-tight sm:text-4xl;
    }

    .compact .event-title {
        @apply text-2xl sm:text-3xl;
    }

    .event-date {
        @apply block text-sm uppercase tracking-wider text-gray-300;
    }

    .event-description {
        @apply mt-6;
        
        p {
            @apply whitespace-pre-wrap font-mono text-lg leading-relaxed tracking-tight text-gray-200;
        }
    }

    .event-actions {
        @apply mt-6 flex gap-4;
        
        a {
            @apply font-semibold;
        }
    }

    .compact .event-actions {
        @apply mt-4;
    }
</style>
