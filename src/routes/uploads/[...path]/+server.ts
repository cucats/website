import { error } from "@sveltejs/kit";
import { stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname } from "node:path";
import { Readable } from "node:stream";
import type { RequestHandler } from "./$types";
import { resolveUploadPath } from "$lib/server/uploads";

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export const GET: RequestHandler = async ({ params }) => {
  const abs = resolveUploadPath(params.path);
  if (!abs) throw error(404, "not found");

  let info;
  try {
    info = await stat(abs);
  } catch {
    throw error(404, "not found");
  }
  if (!info.isFile()) throw error(404, "not found");

  const ext = extname(abs).toLowerCase();
  const stream = Readable.toWeb(createReadStream(abs)) as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Content-Length": String(info.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
