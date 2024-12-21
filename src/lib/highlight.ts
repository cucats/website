import { storeHighlightJs } from "@skeletonlabs/skeleton";
import "highlight.js/styles/github-dark.css";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";

hljs.registerLanguage("lean", python);
storeHighlightJs.set(hljs);

export default hljs;
