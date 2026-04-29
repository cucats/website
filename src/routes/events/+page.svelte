<script lang="ts">
  import Card from "./MainCard.svelte";
  import Calendar from "./Calendar.svelte";
</script>

<svelte:head>
  <title>Events | CUCaTS</title>
</svelte:head>

<main class="bg-primary-800 text-neutral-100">
  <section class="pt-32 pb-8">
    <div class="mx-auto max-w-5xl p-4">
      <h1 class="h1 font-bold">Events</h1>

      <p class="mt-4">
        Thanks to our sponsors, many of our events are free and open to all
        students. Check our private Discord for up-to-date information and
        announcements.
      </p>

      <div class="mt-4 flex gap-4 font-bold">
        <a
          href="webcal://cucats.org/events/calendar.ics"
          class="btn primary p-2 text-sm sm:text-base"
        >
          Add calendar
        </a>
        <a
          href="https://lists.cam.ac.uk/sympa/subscribe/soc-cucats-events"
          class="btn neutral p-2 text-sm sm:text-base"
        >
          Join mailing list
        </a>
      </div>
    </div>
  </section>

  <section class="bg-primary-700">
    <div class="py-16">
      <h2 class="h2 text-center font-bold">Flagship events</h2>
      <div class="mt-8 flex justify-center-safe gap-4 overflow-x-auto p-4">
        <Card
          website="https://camhack.org"
          title="Cam Hack"
          subtitle="Hackathon"
          picture="assets/events/camhack-people.jpg"
        ></Card>

        <Card
          website="https://camgamejam.com"
          title="Cambridge Game Jam"
          subtitle="Game jam"
          picture="assets/events/jam.png"
        ></Card>

        <Card
          website="https://cc.cucats.org/about"
          title="CUCaTS Codevent"
          subtitle="Daily puzzles"
          picture="assets/events/december-challenge.png"
        ></Card>
      </div>

      <p class="mt-4 text-center">
        Our yearly events attract many Cambridge students, giving opportunities
        to compete and win prizes!
      </p>
    </div>
  </section>

  <section class="bg-primary-800 pt-16 text-neutral-300 lg:px-16 lg:pb-16">
    <h2 class="h2 text-center font-bold text-neutral-100">Calendar</h2>
    <div class="mx-auto mt-16 flex max-w-7xl flex-col gap-8">
      <Calendar />
    </div>
  </section>

  <section class="bg-primary-900 overflow-hidden py-40 text-neutral-100">
    <div class="mx-auto max-w-7xl p-16 text-center">
      <h1 class="h1 font-bold">Launch your own event</h1>
      <p class="p mx-auto mt-8 max-w-3xl">
        Are you a student with an event idea? Whether it's a casual picnic or an
        intense contest, we provide funding and support to bring your ideas to
        life.
      </p>
      <div class="mt-8">
        <a
          class="btn primary p-2 text-xl"
          href="https://docs.google.com/document/d/1WQdX0mt8jfy-CM6IOvB9yNzkG19yL9MsVQizpaagKuE/edit?usp=sharing"
          >Learn more</a
        >
      </div>
    </div>
  </section>

  <section class="bg-primary-800 overflow-hidden py-16 text-neutral-100">
    <div class="c-4 mx-auto max-w-5xl text-center">
      <h2 class="h2 px-4 font-bold">Check out other societies</h2>
      <p class="p px-4">
        CUCaTS also partners with other societies to run events!
      </p>

      <div class="flex justify-center-safe gap-4 overflow-x-auto p-4">
        <Card
          website="https://cybersoc.soc.srcf.net"
          title="CyberSoc"
          subtitle="Cybersecurity"
          picture="assets/events/cybersoc.png"
        ></Card>

        <Card
          website="https://uccps.soc.srcf.net"
          title="UCCPS"
          subtitle="Competitive programming"
          picture="assets/events/uccps-resized.png"
        ></Card>
      </div>
    </div>
  </section>
</main>
