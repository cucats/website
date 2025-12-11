import type { RequestHandler } from "./$types";
import fs from "fs";
import path from "path";

import { env } from "$env/dynamic/private";

export const GET: RequestHandler = ({ params }) => {
  const file_path = path.resolve(env.DATA_PATH, params.path);

  // Be careful of directory traversal!
  if (!file_path.startsWith(env.DATA_PATH) || !fs.existsSync(file_path)) {
    return new Response("Not found", { status: 404 });
  }

  const file = fs.readFileSync(file_path);

  return new Response(file);
};
