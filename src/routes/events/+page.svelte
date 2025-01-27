<script lang="ts">
    import { fade } from "svelte/transition";
</script>

<main class="p-4 flex flex-col gap-y-4 max-w-screen-lg mx-auto lg:pt-12" in:fade>
    <h1 class="text-5xl">Events</h1>

    <div class="event-card">
        <div class="title">Cambridge Game Jam 2025</div>
        <div class="date">7 Feb 2025 &ndash; 9 Feb 2025</div>
        <p>
            The Game Jam is similar to a hackathon: you have 48h to develop a game that fits a
            specific theme (revealed at the beginning of the event).
        </p>
        <a href="https://camgamejam.com/" class="btn variant-soft-primary">Website</a>
        <img src="./events/jam.png" alt="Cam Game Jam logo" />
    </div>

    <div class="event-card">
        <div class="title">Puzzle Hunt</div>
        <p>The CUCaTS Puzzle Hunt is returning this year!</p>
        <a href="https://ph.cucats.org" class="btn variant-soft-primary">Website</a>
    </div>

    Check our Discord for up-to-date information.

    <h2 class="my-4 text-4xl">Archive</h2>

    <div class="event-card">
        <div class="title">CUCaTS Advent of Code</div>
        <div class="date">1 Dec 2024 &ndash; 25 Dec 2024</div>
        <p>
            Inspired by the global Advent of Code, our version adds a CUCaTS twist! Each day at
            12:00 p.m., a new challenge will be posted for you to solve and earn points.
        </p>
        <a href="https://aoc.cucats.org/about" class="btn variant-soft-primary">Website</a>
    </div>

    <div class="event-card">
        <div class="title">Cam Hack 2024</div>
        <div class="date">2 Nov 2024 &ndash; 3 Nov 2024</div>
        <p>
            Cam Hack is a 32 hour hackathon for the innovative minds at the University of Cambridge.
            Over an action-packed weekend, students come together to design and build technology
            projects from the ground up.
        </p>
        <a href="https://camhack.org/" class="btn variant-soft-primary">Website</a>
        <img src="./events/camhack.png" alt="Cam Hack logo" />
    </div>
</main>

<style lang="postcss">
    .event-card {
        @apply bg-opacity-60 bg-zinc-900 whitespace-pre-line p-8 md:p-10 md:mx-8 rounded-lg relative text-center md:text-justify;
    }

    .title {
        @apply text-4xl font-bold;
    }

    .date {
        @apply uppercase;
    }

    .event-card p {
        @apply mt-4 text-gray-100 whitespace-normal;
    }

    .event-card a {
        @apply mt-4;
    }

    .event-card img {
        @apply max-h-full flex absolute right-0 top-0 opacity-10 -z-10;
    }
</style>
