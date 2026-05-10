import { env } from "$env/dynamic/private";
import postgres from "postgres";

export const sql = postgres(env.DATABASE_URL ?? "postgres://invalid/invalid", {
  onnotice: () => {},
  types: {
    numeric: {
      to: 1700,
      from: [1700],
      serialize: (n: number | string) => String(n),
      parse: (s: string) => Number(s),
    },
  },
});
