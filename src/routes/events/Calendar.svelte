<script lang="ts">
  import Ical from "ical.js";
  import { onMount } from "svelte";
  import DOMPurify from "dompurify";
  import Modal from "$lib/components/Modal.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";

  import EventData from "./EventData.svelte";

  import CalendarIcon from "$lib/assets/icons/calendar.png?enhanced";
  import LocationIcon from "$lib/assets/icons/location.png?enhanced";

  interface CalendarEvent {
    summary: string;
    start: Date;
    end: Date;
    location?: string;
    description: string;
  }

  interface EventEntry {
    event: CalendarEvent;
    cont: boolean;
  }

  interface CalendarDay {
    date: Date;
    events: EventEntry[];
    isInTerm: boolean;
  }

  const today = new Date();
  const terms = [
    {
      name: "Easter 2025",
      start: new Date("2025-04-29"),
      end: new Date("2025-06-20"),
    },
    {
      name: "Michaelmas 2025",
      start: new Date("2025-10-07"),
      end: new Date("2025-12-05"),
    },
    {
      name: "Lent 2026",
      start: new Date("2026-01-20"),
      end: new Date("2026-03-20"),
    },
    {
      name: "Easter 2026",
      start: new Date("2026-04-17"),
      end: new Date("2026-06-25"),
    },
  ];

  function formatDateDuration(event: CalendarEvent) {
    function formatDateTime(date: Date): string {
      return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    function formatTime(date: Date): string {
      return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (event.start.toDateString() == event.end.toDateString()) {
      return `${formatDateTime(event.start)} - ${formatTime(event.end)}`;
    }

    return `${formatDateTime(event.start)} - ${formatDateTime(event.end)}`;
  }

  let currentTermIndex = $state(3);
  let events = $state<CalendarEvent[]>([]);
  let selectedEvent = $state<CalendarEvent | null>(null);
  let showEventModal = $state(false);

  const currentTerm = $derived(terms[currentTermIndex]);

  const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const calendarDays = $derived.by(() => {
    const termEnd = currentTerm.end;

    const startDayOfWeek = currentTerm.start.getDay();

    // Calendar starts on Monday
    const daysToWeekStart = (startDayOfWeek - 1 + 7) % 7;
    const calendarStart = new Date(currentTerm.start);
    calendarStart.setDate(currentTerm.start.getDate() - daysToWeekStart);

    // Calendar ends on Sunday (complete the last week)
    const endDayOfWeek = termEnd.getDay();
    const daysToWeekEnd = (7 - endDayOfWeek) % 7;
    const calendarEnd = new Date(termEnd);
    calendarEnd.setDate(termEnd.getDate() + daysToWeekEnd);

    // Calculate total days needed
    const totalDays =
      Math.ceil(
        (calendarEnd.getTime() - calendarStart.getTime()) /
          (1000 * 60 * 60 * 24),
      ) + 1;

    // Generate all days

    const days: CalendarDay[] = [];

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(calendarStart);
      date.setDate(calendarStart.getDate() + i);

      // Check if date is within term (inclusive of both start and end dates)
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const termStartDate = new Date(currentTerm.start);
      termStartDate.setHours(0, 0, 0, 0);
      const termEndDate = new Date(termEnd);
      termEndDate.setHours(23, 59, 59, 999);

      const isInTerm = termStartDate <= dateStart && dateStart <= termEndDate;

      // Find events for this day
      const dayEvents: EventEntry[] = [];
      for (const event of events) {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        // Reset to start of day for comparison
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        // Check if event spans this day
        if (eventStart <= dayEnd && eventEnd > dayStart) {
          const cont = eventStart.toDateString() !== date.toDateString();

          dayEvents.push({ event, cont });
        }
      }

      days.push({
        date: new Date(date),
        events: dayEvents,
        isInTerm,
      });
    }

    return days;
  });

  const numberOfWeeks = $derived(Math.ceil(calendarDays.length / 7));

  onMount(async () => {
    try {
      const response = await fetch("/events/calendar.ics");
      const icalText = await response.text();

      const jcalData = Ical.parse(icalText);
      const comp = new Ical.Component(jcalData);
      const vevents = comp.getAllSubcomponents("vevent");

      const parsedEvents: CalendarEvent[] = vevents.map((vevent) => {
        const event = new Ical.Event(vevent);

        return {
          summary: event.summary,
          start: event.startDate.toJSDate(),
          end: event.endDate.toJSDate(),
          location: event.location,
          description: event.description,
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
  class="lg:c-4 from-tertiary-900 via-primary-900 to-tertiary-900 bg-linear-to-br p-0.5 lg:rounded-lg lg:p-8"
>
  <div class="flex items-center justify-between overflow-hidden p-2 pb-10">
    <h2 class="h3 font-semibold text-neutral-200">
      {currentTerm.name}
    </h2>

    <div class="flex items-center gap-2 text-neutral-100">
      <!-- disabled:hover: overrides .btn.primary hover so disabled buttons don't react to hover -->
      <button
        onclick={() => (currentTermIndex = Math.max(0, currentTermIndex - 1))}
        disabled={currentTermIndex === 0}
        class="btn sm primary disabled:hover:brightness-100"
      >
        &lt;-
      </button>
      <button
        onclick={() =>
          (currentTermIndex = Math.min(terms.length - 1, currentTermIndex + 1))}
        disabled={currentTermIndex === terms.length - 1}
        class="btn sm primary disabled:hover:brightness-100"
      >
        -&gt;
      </button>
    </div>
  </div>

  <!-- Calendar Grid -->
  <div>
    <div class="grid gap-0.5 lg:gap-2">
      <!-- Day headers -->
      <div class="grid grid-cols-7 gap-0.5 lg:gap-2">
        <!-- Weekday headings -->
        {#each dayOrder as day}
          <div
            class="text-center text-[8px] font-semibold font-mono text-neutral-50/80 uppercase lg:text-sm"
          >
            <span class="lg:hidden">{day.slice(0, 2)}</span>
            <span class="hidden lg:inline">{day}</span>
          </div>
        {/each}
      </div>

      <!-- Calendar rows -->
      {#each { length: numberOfWeeks } as _, weekIndex}
        <div class="grid grid-cols-7 gap-0.5 lg:gap-2">
          <!-- Day cells -->
          {#each calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7) as day}
            {@const isWeekend =
              day.date.getDay() === 0 || day.date.getDay() === 6}
            {@const isToday =
              day.date.getFullYear() === today.getFullYear() &&
              day.date.getMonth() === today.getMonth() &&
              day.date.getDate() === today.getDate()}
            {@const showMonth =
              day.date.getDate() === 1 ||
              (weekIndex === 0 && day.date.getDay() === 4)}

            <div
              class="h-20 p-0.5 lg:h-32 lg:rounded-lg lg:p-1 {isWeekend
                ? 'bg-neutral-700/50'
                : 'bg-neutral-800/50'} {isToday
                ? 'ring-secondary-700 ring-1 lg:ring-2'
                : ''} {!day.isInTerm ? 'opacity-40' : ''} overflow-hidden"
            >
              <!-- Day of month -->
              <div
                class="text-[8px] font-mono select-none lg:mb-1 lg:text-xs {!day.isInTerm
                  ? 'text-neutral-500'
                  : 'text-neutral-400'}"
              >
                {day.date.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: showMonth ? "short" : undefined,
                })}
              </div>
              <div
                class="h-[calc(100%-14px)] overflow-y-auto lg:h-[calc(100%-20px)]"
              >
                {#each day.events as entry}
                  <button
                    class="bg-primary-600 hover:brightness-125 mb-0.5 w-full cursor-pointer rounded p-0.5 text-left text-[8px] text-neutral-100 transition lg:mb-1 lg:rounded-lg lg:p-1 lg:text-sm"
                    onclick={() => selectEvent(entry.event)}
                  >
                    <div
                      class="overflow-hidden text-clip whitespace-nowrap font-semibold"
                    >
                      {entry.event.summary}
                    </div>
                    <div class="text-[8px] font-sans lg:text-xs">
                      {#if entry.cont}
                        (cont)
                      {:else}
                        {entry.event.start.toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      {/if}
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
</div>

<Modal
  bind:active={showEventModal}
  class="bg-primary-900 relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg p-4 shadow-overlay sm:p-6"
>
  {#if selectedEvent}
    <button
      class="absolute top-4 right-4 cursor-pointer text-neutral-400 hover:text-neutral-100"
      onclick={() => (showEventModal = false)}
      aria-label="Close modal"
    >
      <CloseIcon />
    </button>

    <div>
      <h2 class="h3 mb-4 pr-6 font-semibold text-neutral-100">
        {selectedEvent.summary}
      </h2>

      <div class="flex flex-col gap-4 wrap-anywhere">
        <EventData icon={CalendarIcon} title="Date & Time">
          <p class="text-sm">{formatDateDuration(selectedEvent)}</p>
        </EventData>

        {#if selectedEvent.location}
          <EventData icon={LocationIcon} title="Location">
            <a
              class="a text-sm"
              target="_blank"
              rel="noopener noreferrer"
              href="https://maps.google.com/?q={selectedEvent.location}"
              >{selectedEvent.location}</a
            >
          </EventData>
        {/if}

        {#if selectedEvent.description}
          <div
            class="p event-description border-primary-800 mt-4 border-t pt-4 text-neutral-200"
          >
            {@html DOMPurify.sanitize(selectedEvent.description)}
          </div>
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

  .event-description :global(b) {
    @apply text-white;
  }

  .event-description :global(a) {
    @apply text-secondary-400 decoration-secondary-400 hover:text-secondary-200 hover:decoration-secondary-200 underline underline-offset-2;
  }
</style>
