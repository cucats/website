import type { RequestHandler } from "./$types";
import fs from "fs";
import path from "path";
import { DATA_PATH } from "$env/static/private";

export const GET: RequestHandler = ({ params }) => {
  const file_path = path.resolve(DATA_PATH, params.path);

  // Be careful of directory traversal!
  if (!file_path.startsWith(DATA_PATH) || !fs.existsSync(file_path)) {
    return new Response("Not found", { status: 404 });
  }

  const file = fs.readFileSync(file_path);

  return new Response(file);
};
