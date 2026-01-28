<script lang="ts">
  import type { Picture } from "vite-imagetools";
  import Ical from "ical.js";
  import { onMount } from "svelte";
  import DOMPurify from "dompurify";
  import Modal from "$lib/components/Modal.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";

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
      start: new Date("2026-01-22"),
      end: new Date("2026-03-18"),
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

  let currentTermIndex = $state(1);
  let events = $state<CalendarEvent[]>([]);
  let selectedEvent = $state<CalendarEvent | null>(null);
  let showEventModal = $state(false);
  let weekStartsMonday = $state(false); // false = Thursday first, true = Monday first

  const currentTerm = $derived(terms[currentTermIndex]);

  const dayOrder = $derived(
    weekStartsMonday
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"],
  );

  const calendarDays = $derived.by(() => {
    const termEnd = currentTerm.end;

    const startDayOfWeek = currentTerm.start.getDay();

    // Calculate calendar start based on week preference
    const weekStartDay = weekStartsMonday ? 1 : 4; // Mon, Thu
    const daysToWeekStart = (startDayOfWeek - weekStartDay + 7) % 7;
    const calendarStart = new Date(currentTerm.start);
    calendarStart.setDate(currentTerm.start.getDate() - daysToWeekStart);

    // Calculate calendar end (complete the last week)
    const endDayOfWeek = termEnd.getDay();
    const weekEndDay = weekStartsMonday ? 0 : 3; // Sunday = 0, Wednesday = 3
    // If term already ends on the last day of the week, don't add any days
    const daysToWeekEnd =
      endDayOfWeek === weekEndDay ? 0 : (weekEndDay - endDayOfWeek + 7) % 7;
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
  class="lg:c-4 from-tertiary-900 via-primary-900 to-tertiary-900 border border-neutral-700 bg-linear-to-br p-0.5 lg:rounded-lg lg:p-8"
>
  <div class="flex items-center justify-between overflow-hidden p-2 pb-10">
    <h2 class="text-lg font-bold text-neutral-200 lg:text-3xl">
      {currentTerm.name}
    </h2>

    <div class="flex items-center gap-2 text-neutral-100">
      <!-- <button
        onclick={() => (weekStartsMonday = !weekStartsMonday)}
        class="cursor-pointer rounded bg-neutral-700 px-2 py-1 text-[10px] transition-colors hover:bg-neutral-600 lg:text-sm"
      >
        {weekStartsMonday ? "Mon start" : "Thu start"}
      </button> -->
      <button
        onclick={() => (currentTermIndex = Math.max(0, currentTermIndex - 1))}
        disabled={currentTermIndex === 0}
        class="btn hover:bg-neutral-60 sm bg-neutral-50/20"
      >
        &lt;-
      </button>
      <button
        onclick={() =>
          (currentTermIndex = Math.min(terms.length - 1, currentTermIndex + 1))}
        disabled={currentTermIndex === terms.length - 1}
        class="btn hover:bg-neutral-60 sm bg-neutral-50/20"
      >
        -&gt;
      </button>
    </div>
  </div>

  <!-- Calendar Grid -->
  <div>
    <div class="grid flex-col gap-0.5 lg:gap-2">
      <!-- Day headers -->
      <div class="grid grid-cols-7 gap-0.5 lg:gap-2">
        <!-- Weekday headings -->
        {#each dayOrder as day}
          <div
            class="text-center text-[8px] font-bold text-neutral-50/80 uppercase lg:text-sm"
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
              class="h-20 p-0.5 lg:h-32 lg:rounded lg:p-1 {isWeekend
                ? 'bg-neutral-700/50'
                : 'bg-neutral-800/50'} {isToday
                ? 'ring-secondary-700 ring-1 lg:ring-2'
                : ''} {!day.isInTerm ? 'opacity-40' : ''} overflow-hidden"
            >
              <!-- Day of month -->
              <div
                class="text-[8px] select-none lg:mb-1 lg:text-xs {!day.isInTerm
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
                    class="bg-primary-600 hover:bg-primary-700 mb-0.5 w-full cursor-pointer rounded p-0.5 text-left text-[8px] text-neutral-100 transition-colors lg:mb-1 lg:p-1 lg:text-sm"
                    onclick={() => selectEvent(entry.event)}
                  >
                    <div class="truncate font-bold text-clip">
                      {entry.event.summary}
                    </div>
                    <div class="text-[7px] lg:text-xs">
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
  class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-neutral-700 bg-neutral-900 p-4 shadow-2xl sm:p-6"
>
  {#if selectedEvent}
    <button
      class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-100"
      onclick={() => (showEventModal = false)}
      aria-label="Close modal"
    >
      <CloseIcon />
    </button>

    <div>
      <h2 class="mb-4 pr-6 text-xl font-bold text-neutral-100 sm:text-2xl">
        {selectedEvent.summary}
      </h2>

      {#snippet eventData(icon: Picture, title: string, data: string)}
        <div class="mt-4 flex items-start">
          <enhanced:img src={icon} class="pixel mr-3 size-8" alt={title} />

          <div class="flex-1">
            <h3 class="text-xs font-bold text-neutral-400 uppercase">
              {title}
            </h3>
            <p class="text-sm text-neutral-200">{data}</p>
          </div>
        </div>
      {/snippet}

      <div class="wrap-anywhere">
        {@render eventData(
          CalendarIcon,
          "Date & Time",
          formatDateDuration(selectedEvent),
        )}

        {#if selectedEvent.location}
          {@render eventData(LocationIcon, "Location", selectedEvent.location)}
        {/if}

        {#if selectedEvent.description}
          <div
            class="p event-description mt-4 border-t border-neutral-700 pt-4 text-neutral-200"
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
