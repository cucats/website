<script lang="ts">
    export let active = false;
</script>

<button
    class="hamb"
    aria-controls="mobile-menu"
    aria-expanded="false"
    aria-label="Toggle menu"
    onclick={() => (active = !active)}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path class="top" class:active d="M4 6 l16 0" />
        <path class="middle" class:active d="M4 12 l16 0" />
        <path class="middle2" class:active d="M4 12 l16 0" />
        <path class="bottom" class:active d="M4 18 l16 0" />
    </svg>
</button>

<style lang="postcss">
    button {
        @apply absolute right-0 mx-8 flex items-center sm:hidden;
    }

    .top,
    .middle,
    .middle2,
    .bottom {
        @apply origin-center duration-200;
    }

    .top.active,
    .bottom.active {
        @apply scale-0;
    }

    .middle.active {
        @apply rotate-45;
    }

    .middle2.active {
        @apply rotate-[315deg];
    }
</style>
