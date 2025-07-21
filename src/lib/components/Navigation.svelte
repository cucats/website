<script lang="ts">
    interface Props {
        active?: boolean;
    }

    let { active = $bindable(false) }: Props = $props();

    function onclick() {
        document.body.style.overflowY = "auto";
        active = !active;
    }
</script>

<a class="navlink" href="/about" {onclick}>About Us</a>
<a class="navlink" href="/events" {onclick}>Events</a>
<a class="navlink" href="/sponsors" {onclick}>Sponsors</a>

<style lang="postcss">
    .navlink {
        @apply block p-4 text-xl font-semibold uppercase opacity-80 transition duration-200 ease-in-out hover:opacity-100 sm:text-base sm:hover:scale-105;
    }
</style>
