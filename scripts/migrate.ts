import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const migrationsDir = resolve(process.cwd(), "migrations");
const sql = postgres(databaseUrl, { onnotice: () => {} });

try {
  await sql`
    create table if not exists _migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `;

  let entries: string[];
  try {
    entries = await readdir(migrationsDir);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("no migrations directory; nothing to apply");
      entries = [];
    } else {
      throw err;
    }
  }

  const files = entries.filter((f) => f.endsWith(".sql")).sort();
  const applied = new Set(
    (await sql<{ name: string }[]>`select name from _migrations`).map((r) => r.name),
  );

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip  ${file}`);
      continue;
    }
    const content = await readFile(join(migrationsDir, file), "utf8");
    console.log(`apply ${file}`);
    await sql.begin(async (tx) => {
      await tx.unsafe(content);
      await tx`insert into _migrations (name) values (${file})`;
    });
  }
} finally {
  await sql.end();
}
