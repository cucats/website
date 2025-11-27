<script lang="ts">
  import Event from "./MainEvent.svelte";
  import Calendar from "./Calendar.svelte";
</script>

<main class="bg-tertiary-800">
  <section class="bg-tertiary-800 pt-24 text-neutral-300">
    <div class="c-4 mx-auto max-w-7xl p-4 pt-6">
      <h1 class="text-4xl font-bold md:text-5xl">Events</h1>
      <p>
        Check our private Discord for up-to-date information and announcements.
      </p>
    </div>
  </section>

  <section class="bg-tertiary-900 text-neutral-300">
    <div class="mx-auto max-w-7xl py-8">
      <h1 class="mb-2 ml-2 text-4xl font-bold">Calendar</h1>
      <p class="mb-4 ml-2 text-neutral-300">
        Subscribe to <a
          href="webcal://cucats.org/events/calendar.ics"
          class="underline">the CUCaTS calendar</a
        >
        or
        <a
          href="https://lists.cam.ac.uk/sympa/subscribe/soc-cucats-events?previous_action=info"
          class="underline">the mailing list</a
        >.
      </p>
      <Calendar />
    </div>
  </section>

  <section class="bg-tertiary-700 overflow-hidden text-neutral-300">
    <div class="c-4 mx-auto max-w-7xl py-4">
      <h2 class="mt-4 ml-4 text-3xl font-bold md:text-4xl">Flagship events</h2>
      <p class="ml-4">
        Our yearly events attract many Cambridge students, giving opportunities
        to compete and win prizes!
      </p>
      <div class="flex gap-4 overflow-x-auto p-4 xl:justify-center">
        <Event
          website="https://camhack.org"
          title="Cam Hack"
          picture="assets/events/camhack-people.jpg"
        ></Event>

        <Event
          website="https://camgamejam.com"
          title="Cambridge Game Jam"
          picture="assets/events/jam.png"
        ></Event>

        <Event
          website="https://aoc.cucats.org/about"
          title="CUCaTS Advent of Code"
          picture="assets/events/december-challenge.png"
        ></Event>
      </div>
    </div>
  </section>
</main>
