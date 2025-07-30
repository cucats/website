<script lang="ts">
  import { page } from "$app/state";

  const { error, status } = page;
</script>

<main class="bg-primary-800">
  <section class="pt-24 text-neutral-100">
    <div class="c-4 mx-auto max-w-4xl p-4">
      <h1 class="text-4xl font-bold md:text-5xl">{status}</h1>
      <h2 class="text-3xl font-bold md:text-4xl">{error?.message}</h2>
    </div>
  </section>
</main>
