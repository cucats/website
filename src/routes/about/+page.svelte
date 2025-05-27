<script lang="ts">
    import { fade } from "svelte/transition";
    import Member from "$lib/components/Member.svelte";
    import Aim from "$lib/components/Aim.svelte";

    let x = $state(0);
    let y = $state(0);
    let depth = 600;

    function move(event: MouseEvent) {
        let box = document.getElementById("cucat")?.getBoundingClientRect() ?? new DOMRect();

        let cx = box.x + box.width / 2;
        let cy = box.y + box.height / 2;

        let dx = event.pageX - cx;
        let dy = event.pageY - cy;

        y = Math.atan(dx / depth);
        x = Math.atan(-dy / depth);
    }
</script>

<svelte:body onmousemove={move} />

<main class="main text-gray-100" in:fade>
    <div class="flex sm:mt-20">
        <div class="max-w-lg space-y-4">
            <h1>About Us</h1>
            <p>
                The Cambridge University Computing and Technology Society (CUCaTS) is the primary
                student-run computing society at Cambridge. We aim to provide a platform for
                students to explore and engage with technology, regardless of their degree or
                experience level.
            </p>
            <p>
                With hundreds of members, the society has a thriving community to run both its own
                events and programmes, whilst providing resources and funding to others with similar
                goals.
            </p>
        </div>

        <div class="m-auto hidden md:block" style="perspective: {depth}px; ">
            <img
                id="cucat"
                class="max-h-40 object-contain duration-75"
                style="transform: rotateY({y}rad) rotateX({x}rad)"
                src="/assets/logo/dark/logo-white-cat.png"
                alt="cucats logo"
            />
        </div>
    </div>

    <div class="mt-20">
        <h2>Aims</h2>
        <div class="h-90 mt-4 flex flex-wrap gap-4">
            <Aim
                url="/assets/icons/graph.png"
                title="Build connections"
                desc="Provide members and potential employers with networking opportunities"
            />
            <Aim
                url="/assets/icons/loudspeaker.png"
                title="Promote interest"
                desc="Spark curiosity in computing amongst members and the general public"
            />
            <Aim
                url="/assets/icons/steps.png"
                title="Support members"
                desc="Help and fund members host events that align with our mission"
            />
            <Aim
                url="/assets/icons/text.png"
                title="Encourage discussion"
                desc="Provide a forum to discuss topics and issues concerning computing and IT"
            />
        </div>
    </div>
    <h2 class="mt-32">Committee</h2>

    <div class="flex flex-wrap justify-center gap-10 rounded-lg bg-black bg-opacity-40 px-6 py-10">
        <Member name="Jeremy Chen" role="president" />
        <Member name="Sophie Ring" role="vice-president" />
        <Member name="Bruce Chen" role="treasurer" />
        <Member name="Jonathon Sun" role="secretary" />
        <Member name="Xi Nan Shu" role="webmaster" />
    </div>
    + Many thanks to Steven for GoL!

    <div class="icon-container">
        <a href="https://www.instagram.com/cucats.cam">
            <img src="/assets/socials/Instagram_Glyph_White.svg" alt="Instagram Logo" />
        </a>
        <a href="https://www.facebook.com/cucats/">
            <img src="/assets/socials/Facebook_Logo_Secondary.png" alt="Facebook Logo" />
        </a>
        <a href="https://x.com/cucatscam">
            <img src="/assets/socials/x-logo.svg" alt="X Logo" />
        </a>
    </div>
</main>

<style lang="postcss">
    .icon-container {
        @apply mx-auto my-4 flex gap-8;
    }

    .icon-container img {
        @apply h-10 duration-200 hover:scale-110 sm:h-12;
    }
</style>
