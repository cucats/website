import { env } from "$env/dynamic/private";
import postgres from "postgres";

export const sql = postgres(env.DATABASE_URL ?? "postgres://invalid/invalid", {
  onnotice: () => {},
});
