<script lang="ts">
  import GameOfLife from "./GameOfLife.svelte";
</script>

<main class="bg-tertiary-800">
  <section
    class="from-primary-700 via-secondary-800 to-tertiary-800 relative flex h-[60rem] items-center justify-center bg-gradient-to-b sm:h-[72rem]"
  >
    <div class="absolute bottom-0 z-0 size-full overflow-x-hidden">
      <GameOfLife />
    </div>

    <div class="c-4 z-10 max-w-5xl p-4">
      <div class="flex flex-col items-center gap-4 lg:flex-row">
        <img
          src="/assets/logo/dark/logo-white-cat.svg"
          alt="CUCaTS logo"
          class="size-40"
        />
        <h1
          class="p-4 text-center text-2xl font-bold text-neutral-100 sm:text-4xl md:text-5xl"
        >
          Cambridge University<br />Computing and Technology Society
        </h1>
      </div>
      <h2 class="text-center text-neutral-300">
        The main student-led CS and tech society at the University of Cambridge!
      </h2>
    </div>
  </section>

  <section class="bg-tertiary-800 h-20 text-neutral-100">
    <div class="c-4 z-10 max-w-5xl p-4"></div>
  </section>
</main>
