<script lang="ts">
    import { page } from "$app/stores";

    const user = $page.data.user;
</script>

<a href="/about">About Us</a>
<a href="/events">Events</a>
<a href="/sponsors">Sponsors</a>

<!-- {#if user}
    <form action="/auth/signout" method="POST" class="text-center">
        <button class="btn btn-sm variant-outline-primary">{user.email}</button>
    </form>
{:else}
    <form action="/auth/google" method="GET" class="text-center">
        <button class="btn btn-sm variant-outline-primary">Sign in</button>
    </form>
{/if} -->

<style lang="postcss">
    a {
        @apply btn btn-sm hover:variant-ringed-primary;
    }
</style>
