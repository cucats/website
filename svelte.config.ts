import adapter from "@sveltejs/adapter-node";
import { Config } from "@sveltejs/kit";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config: Config = {
    extensions: [".svelte"],
    preprocess: [vitePreprocess()],
    vitePlugin: {
        inspector: true,
    },
    kit: {
        adapter: adapter(),
    },
};

export default config;
