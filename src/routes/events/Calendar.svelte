<script lang="ts">
  import Ical from "ical.js";
  import { onMount } from "svelte";
  import DOMPurify from "dompurify";
  import Modal from "$lib/components/Modal.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import MetadataItem from "./EventData.svelte";

  interface CalendarEvent {
    summary: string;
    start: Date;
    end: Date;
    location?: string;
    description: string;
    url?: string;
  }

  const today = new Date();
  let currentTermIndex = $state(0);
  let events = $state<CalendarEvent[]>([]);
  let selectedEvent = $state<CalendarEvent | null>(null);
  let showEventModal = $state(false);

  const allTerms = [
    {
      name: "Michaelmas 2025",
      start: new Date("2025-10-09"),
      type: "michaelmas",
    },
    { name: "Lent 2026", start: new Date("2026-01-22"), type: "lent" },
    { name: "Easter 2026", start: new Date("2026-04-30"), type: "easter" },
  ];

  const currentTerm = $derived(allTerms[currentTermIndex]);

  function getWeekNumber(date: Date, termStart: Date): number {
    const diffTime = date.getTime() - termStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
  }

  const eventsByWeek = $derived.by(() => {
    const weekMap = new Map<number, CalendarEvent[]>();

    for (let week = 1; week <= 8; week++) {
      weekMap.set(week, []);
    }

    events.forEach((event) => {
      const eventDate = new Date(event.start);
      const weekNum = getWeekNumber(eventDate, currentTerm.start);

      if (weekNum >= 1 && weekNum <= 8) {
        weekMap.get(weekNum)?.push(event);
      }
    });

    return weekMap;
  });

  onMount(async () => {
    try {
      const response = await fetch("/events/calendar.ics");
      const icalText = await response.text();

      const jcalData = Ical.parse(icalText);
      const comp = new Ical.Component(jcalData);
      const vevents = comp.getAllSubcomponents("vevent");

      const parsedEvents: CalendarEvent[] = vevents.map((vevent) => {
        const event = new Ical.Event(vevent);
        // Get URL from the component properties
        const urlProp = vevent.getFirstPropertyValue("url");

        return {
          summary: event.summary || "",
          start: event.startDate?.toJSDate() || new Date(),
          end: event.endDate?.toJSDate() || new Date(),
          location: event.location || "",
          description: event.description || "",
          url: urlProp?.toString() || undefined,
        };
      });

      events = parsedEvents;
    } catch (error) {
      console.error("Failed to load calendar:", error);
    }
  });

  function selectEvent(event: CalendarEvent) {
    selectedEvent = event;
    showEventModal = true;
  }
</script>

<div
  class="c-4 from-tertiary-700 via-secondary-700 to-primary-700 border-tertiary-300 rounded-lg border bg-gradient-to-br p-6"
>
  <div class="flex items-center justify-between overflow-hidden">
    <h3 class="text-xl font-bold sm:text-2xl">{currentTerm.name}</h3>

    <!-- Uncomment when more terms added -->
    <!-- <div class="flex gap-2">
            <button
                onclick={() => (currentTermIndex = Math.max(0, currentTermIndex - 1))}
                disabled={currentTermIndex === 0}
                class="btn neutral sm"
            >
                &lt;
            </button>
            <button
                onclick={() =>
                    (currentTermIndex = Math.min(allTerms.length - 1, currentTermIndex + 1))}
                disabled={currentTermIndex === allTerms.length - 1}
                class="btn neutral sm"
            >
                &gt;
            </button>
        </div> -->
  </div>

  <!-- Calendar Grid -->
  <div class="overflow-x-auto">
    <div class="grid min-w-[700px] flex-col gap-2">
      <!-- Day headers -->
      <div class="grid grid-cols-[30px_repeat(7,_152px)] gap-2">
        <!-- Empty cell for week numbers -->
        <div class="text-center text-neutral-100">Wk</div>
        <!-- Weekday headings -->
        {#each ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"] as day}
          <div class="text-center font-bold text-neutral-100">
            {day}
          </div>
        {/each}
      </div>

      <!-- Calendar weeks -->
      {#each [0, 1, 2, 3, 4, 5, 6, 7] as week}
        <div class="grid grid-cols-[30px_repeat(7,_152px)] gap-2">
          <!-- Week number -->
          <div
            class="flex items-center justify-center text-sm font-semibold text-neutral-100"
          >
            {week + 1}
          </div>

          <!-- Day cells -->
          {#each [0, 1, 2, 3, 4, 5, 6] as day}
            {@const weekEvents: CalendarEvent[] = eventsByWeek.get(week + 1) || []}
            {@const cellDate = new Date(
              currentTerm.start.getTime() +
                (week * 7 + day) * 24 * 60 * 60 * 1000,
            )}
            {@const dayOfWeek = cellDate.getDay()}
            {@const isWeekend = dayOfWeek === 0 || dayOfWeek === 6}
            {@const isToday =
              cellDate.getFullYear() === today.getFullYear() &&
              cellDate.getMonth() === today.getMonth() &&
              cellDate.getDate() === today.getDate()}

            <div
              class="h-32 rounded p-1 {isWeekend
                ? 'bg-neutral-700/30'
                : 'bg-neutral-800/30'} {isToday
                ? 'ring-secondary-700 ring-2'
                : ''}"
            >
              <!-- Day of month -->
              <div class="mb-1 text-xs text-neutral-400 select-none">
                {cellDate.getDate()}
              </div>
              <div class="overflow-y-auto">
                {#each weekEvents.filter((e) => {
                  const eventDate = new Date(e.start);
                  return eventDate.toDateString() === cellDate.toDateString();
                }) as event}
                  <button
                    class="bg-primary-500 hover:bg-primary-600 w-full cursor-pointer rounded p-1 text-left text-sm transition-colors"
                    onclick={() => selectEvent(event)}
                  >
                    <div class="font-bold">{event.summary}</div>
                    <div class="text-xs">
                      {new Date(event.start).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <p class="mt-4 text-sm text-neutral-300">
    Events are loaded from the CUCaTS calendar.
    <a href="/events/calendar.ics" class="underline">Subscribe to calendar</a>
  </p>
</div>

<!-- Event Details Modal -->
<Modal
  bind:active={showEventModal}
  class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-neutral-800 p-6 shadow-2xl"
>
  {#if selectedEvent}
    {@const startDate = new Date(selectedEvent.start)}
    {@const endDate = new Date(selectedEvent.end)}
    {@const isSameDay = startDate.toDateString() === endDate.toDateString()}

    <button
      class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-100"
      onclick={() => (showEventModal = false)}
      aria-label="Close modal"
    >
      <CloseIcon />
    </button>

    <div class="pr-8">
      <h2 class="mb-4 text-2xl font-bold text-neutral-100">
        {selectedEvent.summary}
      </h2>

      <div class="c-4">
        <MetadataItem icon="/assets/icons/calendar.png" title="Date & Time">
          <p class="text-sm text-neutral-300">
            {#if isSameDay}
              {startDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {startDate.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })} - {endDate.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            {:else}
              {startDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {startDate.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })} - {endDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {endDate.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            {/if}
          </p>
        </MetadataItem>

        {#if selectedEvent.location}
          <MetadataItem icon="/assets/icons/location.png" title="Location">
            <p class="text-sm text-neutral-300">
              {selectedEvent.location}
            </p>
          </MetadataItem>
        {/if}

        {#if selectedEvent.description}
          <MetadataItem
            icon="/assets/icons/description.png"
            title="Description"
          >
            <div class="event-description text-sm text-neutral-300">
              {@html DOMPurify.sanitize(selectedEvent.description)}
            </div>
          </MetadataItem>
        {/if}

        {#if selectedEvent.url}
          <MetadataItem icon="/assets/icons/link.png" title="Link">
            <a
              href={selectedEvent.url}
              target="_blank"
              rel="noopener noreferrer"
              class="text-secondary-400 hover:text-secondary-300 text-sm underline"
            >
              {selectedEvent.url}
            </a>
          </MetadataItem>
        {/if}
      </div>
    </div>
  {/if}
</Modal>

<style lang="postcss">
  @reference "../../app.css";

  .event-description :global(ul) {
    @apply list-disc;
  }

  .event-description :global(ol) {
    @apply list-decimal;
  }

  .event-description :global(li) {
    @apply ml-8;
  }

  .event-description :global(a) {
    @apply text-tertiary-500 hover:text-tertiary-300 underline;
  }
</style>
