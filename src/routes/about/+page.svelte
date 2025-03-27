<script lang="ts">
    import { fade } from "svelte/transition";
    import Member from "$lib/components/Member.svelte";
</script>

<main class="main text-gray-100" in:fade>
    <div class="max-w-lg space-y-4">
        <h1>About Us</h1>
        <p>
            The Cambridge University Computing and Technology Society (CUCaTS) is the primary
            student-run computing society at Cambridge. We aim to provide a platform for students to
            explore and engage with technology, regardless of their degree or experience level.
        </p>
        <p>
            With hundreds of members, the society has a thriving community to run both its own
            events and programmes, whilst providing resources and funding to others with similar
            goals.
        </p>
    </div>

    <div class="mt-20 max-w-lg space-y-4 md:ml-auto">
        <h2>Aims</h2>
        <ol class="ml-8 list-outside list-decimal space-y-4">
            <li>To connect members and potential employers via networking opportunities</li>
            <li>
                To promote interest in computing and information technology amongst members and the
                general public
            </li>
            <li>
                To provide a forum for discussion on issues and topics concerning information
                technology
            </li>
            <li>To support members in hosting events that align with our mission</li>
        </ol>
    </div>

    <h2 class="mx-auto mb-8 mt-20">Committee</h2>

    <div class="mx-auto grid grid-cols-2 justify-center gap-x-8 gap-y-12 md:gap-x-24">
        <Member name="Jeremy Chen" role="president" />
        <Member name="Sophie Ring" role="vice-president" />
        <Member name="Bruce Chen" role="treasurer" />
        <Member name="Jonathon Sun" role="secretary" />
        <Member name="Xi Nan Shu" role="webmaster" />
    </div>

    <h2 class="mx-auto mt-20">Socials</h2>
    <div class="icon-container">
        <a href="https://www.instagram.com/cucats.cam">
            <img src="socials/Instagram_Glyph_White.svg" alt="Instagram Logo" />
        </a>
        <a href="https://www.facebook.com/cucats/">
            <img src="socials/Facebook_Logo_Secondary.png" alt="Facebook Logo" />
        </a>
        <a href="https://x.com/cucatscam">
            <img src="socials/x-logo.svg" alt="X Logo" />
        </a>
    </div>
</main>

<style lang="postcss">
    .icon-container {
        @apply mx-auto my-4 flex gap-8;
    }

    .icon-container img {
        @apply h-12 duration-200 hover:scale-110;
    }
</style>
