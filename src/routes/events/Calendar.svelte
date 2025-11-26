<script lang="ts">
  import Ical from "ical.js";
  import { onMount } from "svelte";
  import DOMPurify from "dompurify";
  import Modal from "$lib/components/Modal.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import MetadataItem from "./EventData.svelte";

  import CalendarIcon from "$lib/assets/icons/calendar.png?enhanced";
  import LocationIcon from "$lib/assets/icons/location.png?enhanced";
  import DescriptionIcon from "$lib/assets/icons/description.png?enhanced";
  import LinkIcon from "$lib/assets/icons/link.png?enhanced";

  interface CalendarEvent {
    summary: string;
    start: Date;
    end: Date;
    location?: string;
    description: string;
    url?: string;
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
  ];

  let currentTermIndex = $state(1);
  let events = $state<CalendarEvent[]>([]);
  let selectedEvent = $state<CalendarEvent | null>(null);
  let showEventModal = $state(false);
  let weekStartsMonday = $state(true); // false = Thursday first, true = Monday first

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
        // Get URL from the component properties
        const urlProp = vevent.getFirstPropertyValue("url");

        return {
          summary: event.summary,
          start: event.startDate.toJSDate(),
          end: event.endDate.toJSDate(),
          location: event.location,
          description: event.description,
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
  class="from-tertiary-700 via-secondary-700 to-primary-700 lg:c-4 bg-gradient-to-br p-0.5 lg:rounded-lg lg:p-8"
>
  <div class="flex items-center justify-between overflow-hidden p-2">
    <h2 class="text-lg font-bold lg:text-2xl">{currentTerm.name}</h2>

    <div class="flex items-center gap-2">
      <!-- <button
        onclick={() => (weekStartsMonday = !weekStartsMonday)}
        class="cursor-pointer rounded bg-neutral-700 px-2 py-1 text-[10px] transition-colors hover:bg-neutral-600 lg:text-sm"
      >
        {weekStartsMonday ? "Mon start" : "Thu start"}
      </button> -->
      <button
        onclick={() => (currentTermIndex = Math.max(0, currentTermIndex - 1))}
        disabled={currentTermIndex === 0}
        class="btn neutral sm"
      >
        &lt;
      </button>
      <button
        onclick={() =>
          (currentTermIndex = Math.min(terms.length - 1, currentTermIndex + 1))}
        disabled={currentTermIndex === terms.length - 1}
        class="btn neutral sm"
      >
        &gt;
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
            class="text-center text-[8px] font-bold text-neutral-100 lg:text-sm"
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
                    class="bg-primary-600 hover:bg-primary-700 mb-0.5 w-full cursor-pointer rounded p-0.5 text-left text-[8px] transition-colors lg:mb-1 lg:p-1 lg:text-sm"
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

  <p class="p-2 text-sm text-neutral-300">
    Events are loaded from the CUCaTS calendar. Subscribe to <a
      href="webcal://cucats.org/events/calendar.ics"
      class="underline">the CUCaTS calendar</a
    >
    or
    <a
      href="https://lists.cam.ac.uk/sympa/subscribe/soc-cucats-events?previous_action=info"
      class="underline">the mailing list</a
    >.
  </p>
</div>

<Modal
  bind:active={showEventModal}
  class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-neutral-800 p-4 shadow-2xl sm:p-6"
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

    <div>
      <h2 class="mb-4 pr-6 text-xl font-bold text-neutral-100 sm:text-2xl">
        {selectedEvent.summary}
      </h2>

      <div class="c-4 wrap-anywhere">
        <MetadataItem icon={CalendarIcon} title="Date & Time">
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
          <MetadataItem icon={LocationIcon} title="Location">
            <p class="text-sm text-neutral-300">
              {selectedEvent.location}
            </p>
          </MetadataItem>
        {/if}

        {#if selectedEvent.description}
          <MetadataItem icon={DescriptionIcon} title="Description">
            <div class="event-description text-sm text-neutral-300">
              {@html DOMPurify.sanitize(selectedEvent.description)}
            </div>
          </MetadataItem>
        {/if}

        {#if selectedEvent.url}
          <MetadataItem icon={LinkIcon} title="Link">
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
