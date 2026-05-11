<script lang="ts">
  import { page } from "$app/state";
</script>

<h1 class="h2 mb-2 text-neutral-100">Admin</h1>
<p class="p text-neutral-400">
  Signed in as {page.data.session?.user?.email}.
</p>
