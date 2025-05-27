<script lang="ts">
    import { page } from "$app/stores";
    interface Props {
        active?: boolean;
    }

    let { active = $bindable(false) }: Props = $props();

    const user = $page.data.user;

    function onclick() {
        document.body.style.overflowY = "auto";
        active = !active;
    }
</script>

<a class="navlink" href="/about" {onclick}>About Us</a>
<a class="navlink" href="/events" {onclick}>Events</a>
<a class="navlink" href="/sponsors" {onclick}>Sponsors</a>

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
        @apply block p-4 text-xl font-semibold uppercase opacity-80 transition duration-200 ease-in-out hover:opacity-100 sm:text-base sm:hover:scale-105;
    }
</style>
