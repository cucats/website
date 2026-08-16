<script lang="ts">
  import { page } from "$app/state";

  const { error, status } = page;
</script>

<main class="bg-primary-800">
  <section class="pt-16 text-neutral-200">
    <div class="c-4 mx-auto max-w-4xl p-4">
      <h1 class="h1 font-bold font-mono">{status}</h1>
      <h2 class="h2 mt-4 font-bold">{error?.message}</h2>
    </div>
  </section>
</main>
