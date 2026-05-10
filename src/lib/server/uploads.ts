import { mkdir, writeFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { randomUUID } from "node:crypto";

const UPLOADS_DIR = resolve(process.cwd(), "uploads");

const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function saveUpload(file: File): Promise<string> {
  if (file.size === 0) throw new Error("empty file");
  if (file.size > MAX_BYTES) throw new Error("file too large");
  const ext = extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) throw new Error("unsupported file type");

  await mkdir(UPLOADS_DIR, { recursive: true });
  const name = `${randomUUID()}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(resolve(UPLOADS_DIR, name), buf);
  return `/uploads/${name}`;
}

export function resolveUploadPath(relPath: string): string | null {
  const safe = resolve(UPLOADS_DIR, relPath);
  if (!safe.startsWith(UPLOADS_DIR + sep)) return null;
  return safe;
}
