<script lang="ts">
  import Event from "./MainEvent.svelte";
  import Calendar from "./Calendar.svelte";
</script>

<svelte:head>
  <title>Events | CUCaTS</title>
</svelte:head>

<main class="bg-primary-800">
  <section class="pt-32 pb-8 text-neutral-200">
    <div class="c-4 mx-auto max-w-5xl p-4">
      <h1 class="h1 font-bold">Events</h1>
      <p class="p">
        Check our private Discord for up-to-date information and announcements.
        We also support students running their own events! <a
          class="a"
          href="https://docs.google.com/document/d/1WQdX0mt8jfy-CM6IOvB9yNzkG19yL9MsVQizpaagKuE/edit?usp=sharing"
          >Click here</a
        > for more details.
      </p>
      <div class="flex gap-4 font-bold">
        <a
          href="webcal://cucats.org/events/calendar.ics"
          class="btn primary p-2 text-sm sm:text-base"
        >
          Add calendar
        </a>
        <a
          href="https://lists.cam.ac.uk/sympa/subscribe/soc-cucats-events"
          class="btn neutral border border-neutral-600 p-2 text-sm sm:text-base"
        >
          Join mailing list
        </a>
      </div>
    </div>
  </section>

  <section class="bg-primary-700 overflow-hidden text-neutral-200">
    <div class="c-4 mx-auto max-w-5xl px-4 py-4">
      <h2 class="h2 mt-4 font-bold">Flagship events</h2>
      <p class="p">
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

      <h2 class="h2 mt-8 font-bold">Societies</h2>
      <p class="p">
        CUCaTS also supports other societies (with nicher specialisations) for 
        computer science students, primarily through funding.
      </p>

      <div class="flex gap-4 overflow-x-auto p-4 xl:justify-center">
        <Event
          website="https://cybersoc.soc.srcf.net"
          title="CyberSoc"
          subtitle="Cambridge Cybersecurity Society"
        ></Event>

        <Event
          website="https://uccps.soc.srcf.net"
          title="UCCPS"
          subtitle="Uni of Cambridge Competitive Programming Society"
        ></Event>
      </div>
    </div>
  </section>

  <section class="bg-primary-900 text-neutral-300 lg:p-16">
    <div class="mx-auto max-w-7xl">
      <Calendar />
    </div>
  </section>
</main>
