<script lang="ts">
  import GameOfLife from "./GameOfLife.svelte";
</script>

<svelte:head>
  <title>CUCaTS</title>
</svelte:head>

<main class="bg-tertiary-800">
  <section
    class="from-primary-700 via-secondary-800 to-tertiary-800 relative flex h-screen items-center justify-center bg-linear-to-b"
  >
    <div class="absolute bottom-0 z-0 size-full overflow-hidden">
      <GameOfLife />
    </div>

    <div class="z-10">
      <div
        class="flex flex-col items-center justify-center gap-x-8 sm:flex-row"
      >
        <enhanced:img
          src="$lib/assets/logo/dark/logo-white-cat.svg"
          alt="CUCaTS logo"
          class="size-40 select-none"
        />
        <h1 class="text-center text-6xl font-bold text-neutral-100 sm:text-8xl">
          CUCaTS
        </h1>
      </div>

      <p
        class="mt-2 px-4 text-center text-lg font-bold text-neutral-300 sm:mt-0"
      >
        Cambridge University Computing and Technology Society
      </p>
    </div>
  </section>

  <section class="bg-tertiary-950 overflow-clip px-4 py-40 text-neutral-200">
    <div class="c-4 z-10 mx-auto max-w-3xl">
      <p class="p mt-8">
        Cambridge University Computing and Technology Society (<strong
          >CUCaTS</strong
        >) is the primary student-run computing society at Cambridge. We aim to
        provide a platform for students to explore and engage with technology,
        regardless of their degree or experience level.
      </p>

      <p class="p">
        With hundreds of members, the society has a thriving community to run
        both its own events and programmes, whilst providing resources and
        funding to others with similar goals.
      </p>
    </div>

    <h1 class="h1 mt-40 mb-8 text-center font-bold text-neutral-50">
      Our aims
    </h1>

    {#snippet aim(
      image: string,
      alt: string,
      title: string,
      description: string,
    )}
      <div class="gap-4 p-4 px-4 py-8 text-center">
        <img src={image} class="pixel mx-auto size-16 sm:size-24" {alt} />

        <p class="mt-4 text-lg font-bold text-neutral-100 uppercase">
          {title}
        </p>

        <p class="mt-2 text-lg">{description}</p>
      </div>
    {/snippet}

    <div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
      {@render aim(
        "assets/icons/graph.svg",
        "graph",
        "Build connections",
        "Provide members and potential employers with networking opportunities",
      )}
      {@render aim(
        "assets/icons/loudspeaker.svg",
        "loudspeaker",
        "Promote interest",
        "Spark curiosity in computing amongst members and the general public",
      )}
      {@render aim(
        "assets/icons/steps.svg",
        "steps",
        "Support members",
        "Help and fund members host events that align with our mission",
      )}
      {@render aim(
        "assets/icons/text.svg",
        "text",
        "Encourage discussion",
        "Provide a forum to discuss topics and issues concerning computing and IT",
      )}
    </div>

    <div class="mt-60 flex flex-col items-center gap-6">
      <div class="relative h-120 w-120">
        <img
          src="/assets/events/camhack-map-project.jpg"
          class="picture right-10 bottom-10"
          alt=""
        />
        <img
          src="/assets/events/december-challenge.png"
          class="picture bottom-60 left-20"
          alt=""
        />
        <img
          src="/assets/events/camhack-people.jpg"
          class="picture top-0 right-80"
          alt=""
        />
        <img
          src="/assets/events/camhack-crowd.jpg"
          class="picture top-20 left-70"
          alt=""
        />
      </div>
      <h1 class="h1 text-center font-bold text-neutral-100">Join our events</h1>
      <p class="p text-center">
        We run several major events every year, and help other students run
        their own!
      </p>
      <a href="/events" class="btn primary p-3 text-xl">See events</a>
    </div>
  </section>
</main>

<style lang="postcss">
  @reference "tailwindcss";

  .picture {
    @apply absolute max-h-80 max-w-80 rounded-lg;
  }
</style>
