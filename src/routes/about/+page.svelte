<script lang="ts">
    import { fade } from "svelte/transition";
</script>

<main class="mx-auto flex max-w-screen-lg flex-col gap-y-6 p-4 pt-12" in:fade>
    <h1>About Us</h1>
    <p>
        The Cambridge University Computing and Technology Society (CUCaTS) is the primary
        student-run society at the University of Cambridge. We aim to provide a platform for
        students to explore and engage with technology, regardless of their degree or experience
        level.
    </p>
    <p>
        With hundreds of members, the society has a thriving community to run both its own
        events/programmes and provide resources and funding to those who want to do the same.
    </p>
    <h2>Aims</h2>
    <ol class="list ml-2">
        <li>
            1. To promote interest for members and the public in computing and information
            technology
        </li>
        <li>2. To provide members with networking opportunities with potential employers</li>
        <li>
            3. To provide a forum for discussion on issues and topics concerning information
            technology
        </li>
        <li>
            4. To provide members with funding and assistance in setting up and running their own
            events that align with the society's aims
        </li>
    </ol>
    <h2>Committee</h2>
    <ul class="list ml-2">
        <li>President: Jeremy Chen (president@cucats.org)</li>
        <li>Vice-President: Sophie Ring (vice-president@cucats.org)</li>
        <li>Junior Treasurer: Bruce Chen (treasurer@cucats.org)</li>
        <li>Secretary: Jonathon Sun (secretary@cucats.org)</li>
    </ul>
    <div class="icon-container">
        <a href="https://www.instagram.com/cucats.cam">
            <img class="icon-logo" src="socials/Instagram_Glyph_White.svg" alt="Instagram Logo" />
        </a>
        <a href="https://www.facebook.com/cucats/">
            <img class="icon-logo" src="socials/Facebook_Logo_Secondary.png" alt="Facebook Logo" />
        </a>
        <a href="https://x.com/cucatscam">
            <img class="icon-logo" src="socials/x-logo.svg" alt="X Logo" />
        </a>
    </div>
</main>

<style lang="postcss">
    .icon-container {
        @apply flex gap-8;
    }

    .icon-container img {
        @apply h-12;
    }
</style>
