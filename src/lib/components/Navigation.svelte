<script lang="ts">
    import { page } from "$app/stores";

    const user = $page.data.user;

    function allowScroll() {
        document.body.style.overflowY = "auto";
    }
</script>

<a class="btn btn-sm hover:variant-ringed-primary" href="/about" on:click="{allowScroll}">About Us</a>
<a class="btn btn-sm hover:variant-ringed-primary" href="/events" on:click="{allowScroll}">Events</a>
<a class="btn btn-sm hover:variant-ringed-primary" href="/sponsors" on:click="{allowScroll}">Sponsors</a>

<!-- {#if user}
    <form action="/auth/signout" method="POST" class="text-center">
        <button class="btn btn-sm variant-outline-primary">{user.email}</button>
    </form>
{:else}
    <form action="/auth/google" method="GET" class="text-center">
        <button class="btn btn-sm variant-outline-primary">Sign in</button>
    </form>
{/if} -->
