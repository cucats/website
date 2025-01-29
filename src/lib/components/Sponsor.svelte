<script>
    export let sponsor;

    /**
     * @param {string} id - Sponsor name
     */
    function togglePopUp(id) {
        document.getElementById(id)?.classList.toggle("hidden");
        document.body.style.overflowY =
            document.body.style.overflowY == "hidden" ? "auto" : "hidden";
    }
</script>

<!-- Couldn't get tailwind to work so just set style manually... -->
<button
    class="sponsor-card"
    style="background: linear-gradient(#fff9, #fffa)"
    onclick={() => togglePopUp(sponsor.name)}
>
    <img src={sponsor.logo} alt="{sponsor.name} logo" />
</button>

<div class="popup-container hidden" id={sponsor.name}>
    <div class="popup">
        <img src={sponsor.logo} alt="{sponsor.name} logo" />

        {#each sponsor.paragraphs as paragraph}
            <p>{paragraph}</p>
        {/each}

        <div class="button-container">
            {#each Object.entries(sponsor.links) as [key, value]}
                <a href={value} class="btn variant-soft-primary">{key}</a>
            {/each}
            <button onclick={() => togglePopUp(sponsor.name)}>Close</button>
        </div>
    </div>
</div>

<style lang="postcss">
    .sponsor-card {
        @apply flex flex-col w-80 items-center rounded-xl p-4 shadow-sm hover:shadow-2xl hover:scale-105 transition;

        img {
            @apply object-contain h-20 my-8;
        }
    }

    .button-container {
        @apply flex justify-center w-full pt-4 gap-x-8 gap-y-4 flex-wrap;

        a {
            @apply capitalize;
        }

        button {
            @apply text-slate-200 hover:text-white;
        }
    }

    .popup-container {
        @apply bg-black bg-opacity-60 fixed pt-24 top-0 h-full w-full;
    }

    .popup {
        @apply overflow-y-scroll bg-cyan-800 bg-opacity-100 p-10 rounded-xl max-h-full max-w-screen-lg mx-auto;

        p {
            @apply my-4;
        }

        img {
            @apply object-contain h-24;
        }
    }
</style>
