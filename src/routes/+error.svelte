<script lang="ts">
  import { page } from "$app/state";

  const { error, status } = page;
</script>

<main class="bg-primary-800">
  <section class="pt-16 text-neutral-100">
    <div class="c-4 mx-auto max-w-4xl p-4">
      <div class="h1 font-semibold font-mono">{status}</div>
      <h2 class="h2 mt-4 font-semibold">{error?.message}</h2>
    </div>
  </section>
</main>
