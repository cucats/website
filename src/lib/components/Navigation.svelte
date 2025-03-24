<script lang="ts">
    import { page } from "$app/stores";

    const user = $page.data.user;

    function allowScroll() {
        document.body.style.overflowY = "auto";
    }
</script>

<a class="navlink" href="/about" on:click={allowScroll}>About Us</a>
<a class="navlink" href="/events" on:click={allowScroll}>Events</a>
<a class="navlink" href="/sponsors" on:click={allowScroll}>Sponsors</a>

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
    .navlink {
        @apply ml-4 block p-4 text-3xl opacity-80 transition duration-200 ease-in-out hover:opacity-100 sm:text-lg sm:hover:scale-105;
    }
</style>
