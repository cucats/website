<script lang="ts">
  import Event from "./MainEvent.svelte";
  import Calendar from "./Calendar.svelte";
</script>

<main class="bg-primary-800">
  <section class="pt-24 text-neutral-200">
    <div class="c-4 mx-auto max-w-5xl p-4 pt-6">
      <h1 class="text-4xl font-bold md:text-5xl">Events</h1>
      <p>
        Check our private Discord for up-to-date information and announcements.
      </p>
      <p class="mb-4 flex gap-4 text-neutral-300">
        <a
          href="webcal://cucats.org/events/calendar.ics"
          class="text-primary-400 hover:underline"
        >
          Add calendar
        </a>
        <a
          href="https://lists.cam.ac.uk/sympa/subscribe/soc-cucats-events"
          class="text-primary-400 hover:underline"
        >
          Join mailing list
        </a>
      </p>
    </div>
  </section>

  <section class="bg-primary-700 overflow-hidden text-neutral-200">
    <div class="c-4 mx-auto max-w-5xl px-4 py-4">
      <h2 class="mt-4 text-3xl font-bold md:text-4xl">Flagship events</h2>
      <p>
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
          website="https://cc.cucats.org/about"
          title="CUCaTS Codevent Calendar"
          picture="assets/events/december-challenge.png"
        ></Event>
      </div>
    </div>
  </section>

  <section class="bg-tertiary-900 text-neutral-300">
    <div class="mx-auto max-w-7xl py-8">
      <Calendar />
    </div>
  </section>
</main>
