// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { Session } from "@auth/sveltekit";

declare global {
  namespace App {
    interface Locals {
      auth: () => Promise<Session | null>;
    }
    interface PageData {
      session?: Session | null;
    }
    // interface Error {}
    // interface Platform {}
  }
}

declare module "@auth/sveltekit" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      isAdmin: boolean;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId?: string;
    isAdmin?: boolean;
  }
}

export {};
