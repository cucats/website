import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: [".svelte"],
    preprocess: [vitePreprocess()],
    vitePlugin: {
        inspector: true,
    },
    kit: {
        adapter: adapter({
            precompress: true,
        }),
        alias: {
            data: "src/data",
        },
    },
};

export default config;
