<script lang="ts">
    import { fade } from "svelte/transition";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<main class="main" in:fade>
    <div class="mx-auto flex max-w-screen-sm flex-col gap-y-4">
        <h1>{data.name}</h1>

        {#each data.paragraphs as p}
            <p class="text-gray-200">{p}</p>
        {/each}

        <div class="mt-4 flex flex-wrap justify-center gap-4">
            {#each data.links as link}
                <a class="rounded-md bg-black bg-opacity-40" href={link.url}>
                    {link.text}
                </a>
            {/each}

            <a class="text-gray-200" href="/sponsors">Back</a>
        </div>
    </div>
</main>

<style lang="postcss">
    a {
        @apply text-nowrap p-4 font-bold uppercase opacity-90 duration-200 hover:scale-105 hover:opacity-100;
    }
</style>
