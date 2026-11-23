import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import worker from "./dist/_worker.js";
const root = resolve("dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
const assets = {
  async fetch(req) {
    const url = new URL(req.url),
      path = resolve(root, "." + decodeURIComponent(url.pathname));
    if (!path.startsWith(root + sep) && path !== root)
      return new Response(null, { status: 403 });
    try {
      const dir = (await stat(path)).isDirectory();
      if (dir && !url.pathname.endsWith("/"))
        return Response.redirect(
          url.origin + url.pathname + "/" + url.search,
          301,
        );
      const file = dir ? path + "/index.html" : path;
      return new Response(await readFile(file), {
        headers: {
          "content-type": types[extname(file)] ?? "application/octet-stream",
        },
      });
    } catch {
      return new Response(await readFile(root + "/404.html"), {
        status: 404,
        headers: { "content-type": "text/html" },
      });
    }
  },
};
const port = Number(process.env.PORT || 4173);
http
  .createServer(async (req, res) => {
    try {
      const result = await worker.fetch(
        new Request(new URL(req.url, "http://localhost:" + port), {
          method: req.method,
        }),
        { ASSETS: assets },
      );
      res.writeHead(result.status, Object.fromEntries(result.headers));
      res.end(
        req.method === "HEAD"
          ? undefined
          : Buffer.from(await result.arrayBuffer()),
      );
    } catch {
      res.writeHead(400);
      res.end("Bad request");
    }
  })
  .listen(port, "127.0.0.1", () => console.log("http://localhost:" + port));
