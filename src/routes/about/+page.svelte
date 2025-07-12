<script lang="ts">
    import { fade } from "svelte/transition";

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
        <div class="mt-4 flex flex-wrap gap-4">
            <div class="min-w-80 flex-1 rounded-lg bg-black bg-opacity-40 p-8">
                <img src="/assets/icons/graph.png" class="h-8" alt="Build connections icon" />
                <div class="mt-4 text-xl font-bold uppercase">Build connections</div>
                <p class="mt-4">
                    Provide members and potential employers with networking opportunities
                </p>
            </div>
            <div class="min-w-80 flex-1 rounded-lg bg-black bg-opacity-40 p-8">
                <img src="/assets/icons/loudspeaker.png" class="h-8" alt="Promote interest icon" />
                <div class="mt-4 text-xl font-bold uppercase">Promote interest</div>
                <p class="mt-4">
                    Spark curiosity in computing amongst members and the general public
                </p>
            </div>
            <div class="min-w-80 flex-1 rounded-lg bg-black bg-opacity-40 p-8">
                <img src="/assets/icons/steps.png" class="h-8" alt="Support members icon" />
                <div class="mt-4 text-xl font-bold uppercase">Support members</div>
                <p class="mt-4">Help and fund members host events that align with our mission</p>
            </div>
            <div class="min-w-80 flex-1 rounded-lg bg-black bg-opacity-40 p-8">
                <img src="/assets/icons/text.png" class="h-8" alt="Encourage discussion icon" />
                <div class="mt-4 text-xl font-bold uppercase">Encourage discussion</div>
                <p class="mt-4">
                    Provide a forum to discuss topics and issues concerning computing and IT
                </p>
            </div>
        </div>
    </div>
    <h2 class="mt-32">Committee</h2>

    <div class="flex flex-wrap justify-center gap-10 rounded-lg bg-black bg-opacity-40 px-6 py-10">
        <div class="min-w-40 md:min-w-64">
            <div class="text-sm md:text-base">
                <span class="mr-2 block font-bold lowercase md:inline">president</span><span
                    class="inline text-gray-300 opacity-60">@cucats.org</span
                >
            </div>
            <div class="text-xl font-medium tracking-tight md:text-3xl">Jeremy Chen</div>
        </div>
        <div class="min-w-40 md:min-w-64">
            <div class="text-sm md:text-base">
                <span class="mr-2 block font-bold lowercase md:inline">vice-president</span><span
                    class="inline text-gray-300 opacity-60">@cucats.org</span
                >
            </div>
            <div class="text-xl font-medium tracking-tight md:text-3xl">Sophie Ring</div>
        </div>
        <div class="min-w-40 md:min-w-64">
            <div class="text-sm md:text-base">
                <span class="mr-2 block font-bold lowercase md:inline">treasurer</span><span
                    class="inline text-gray-300 opacity-60">@cucats.org</span
                >
            </div>
            <div class="text-xl font-medium tracking-tight md:text-3xl">Bruce Chen</div>
        </div>
        <div class="min-w-40 md:min-w-64">
            <div class="text-sm md:text-base">
                <span class="mr-2 block font-bold lowercase md:inline">secretary</span><span
                    class="inline text-gray-300 opacity-60">@cucats.org</span
                >
            </div>
            <div class="text-xl font-medium tracking-tight md:text-3xl">Jonathon Sun</div>
        </div>
        <div class="min-w-40 md:min-w-64">
            <div class="text-sm md:text-base">
                <span class="mr-2 block font-bold lowercase md:inline">webmaster</span><span
                    class="inline text-gray-300 opacity-60">@cucats.org</span
                >
            </div>
            <div class="text-xl font-medium tracking-tight md:text-3xl">Xi Nan Shu</div>
        </div>
    </div>
    + Many thanks to Steven for GoL!

    <div class="mx-auto my-4 flex gap-8">
        <a href="https://www.instagram.com/cucats.cam">
            <img
                src="/assets/socials/instagram.svg"
                alt="Instagram Logo"
                class="h-10 duration-200 hover:scale-110 sm:h-12"
            />
        </a>
        <a href="https://www.facebook.com/cucats/">
            <img
                src="/assets/socials/facebook.png"
                alt="Facebook Logo"
                class="h-10 duration-200 hover:scale-110 sm:h-12"
            />
        </a>
        <a href="https://x.com/cucatscam">
            <img
                src="/assets/socials/x.svg"
                alt="X Logo"
                class="h-10 duration-200 hover:scale-110 sm:h-12"
            />
        </a>
    </div>
</main>
