import type { SubmitFunction } from "@sveltejs/kit";
import { toasts } from "$lib/toasts.svelte";

type Options = {
  success?: string;
  error?: (msg: string) => string;
};

export function toastSubmit(options: Options = {}): SubmitFunction {
  const successMsg = options.success ?? "Saved";
  const errorFn = options.error ?? ((m) => m || "Something went wrong");
  return () => {
    return async ({ result, update }) => {
      if (result.type === "success") {
        toasts.show(successMsg, "success");
      } else if (result.type === "failure") {
        const msg = (result.data as { error?: string } | undefined)?.error ?? "";
        toasts.show(errorFn(msg), "error", 3500);
      } else if (result.type === "error") {
        toasts.show("Network error", "error", 3500);
      }
      await update();
    };
  };
}
