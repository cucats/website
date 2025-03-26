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
    style="background: linear-gradient(#fff9, #ccca)"
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
                <a href={value} class="variant-soft-primary btn">{key}</a>
            {/each}
            <button onclick={() => togglePopUp(sponsor.name)}>Close</button>
        </div>
    </div>
</div>

<style lang="postcss">
    .sponsor-card {
        @apply flex w-72 flex-col items-center rounded-xl p-4 shadow-sm transition hover:scale-105 hover:shadow-2xl;

        img {
            @apply my-8 h-20 object-contain;
        }
    }

    .button-container {
        @apply flex w-full flex-wrap justify-center gap-x-8 gap-y-4 pt-4;

        a {
            @apply capitalize;
        }

        button {
            @apply text-slate-200 hover:text-white;
        }
    }

    .popup-container {
        @apply fixed top-0 h-full w-full bg-black bg-opacity-60 pt-24 backdrop-blur-xl;
    }

    .popup {
        @apply mx-auto max-h-full max-w-screen-lg overflow-y-scroll rounded-xl bg-cyan-800 bg-opacity-100 p-10;

        p {
            @apply my-4;
        }

        img {
            @apply h-24 object-contain;
        }
    }
</style>
