import {
  mkdir,
  readFile,
  readdir,
  writeFile,
  cp,
  mkdtemp,
  rm,
} from "node:fs/promises";
import { puzzle, layout, esc, origin, longDate } from "./render.mjs";
import { guides } from "./guides.mjs";
const today = new Date().toISOString().slice(0, 10);
const records = {};
const fail = (file) => {
  throw new Error("Invalid daily board: " + file);
};
for (const file of (await readdir("data"))
  .filter((f) => f.endsWith(".json"))
  .sort()
  .reverse()) {
  const b = JSON.parse(await readFile("data/" + file, "utf8"));
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(b.date) ||
    !Number.isFinite(Date.parse(b.date)) ||
    new Date(b.date).toISOString().slice(0, 10) !== b.date ||
    file !== b.date + ".json" ||
    b.date > today ||
    !["verified", "partial", "reported"].includes(b.status) ||
    !/^https:\/\//.test(b.source) ||
    !Number.isFinite(Date.parse(b.checkedAt)) ||
    b.rounds?.length !== 7
  )
    fail(file);
  const source = new URL(b.source);
  if (b.status !== "reported" && source.hostname !== "playdaily.org")
    fail(file);
  if (
    Date.parse(b.checkedAt) < Date.parse(b.date) ||
    Date.parse(b.checkedAt) > Date.now()
  )
    fail(file);
  if (new Set(b.rounds.map((r) => r.question)).size !== 7) fail(file);
  for (const r of b.rounds) {
    if (
      !r.question?.trim() ||
      !r.hint?.trim() ||
      !Array.isArray(r.answers) ||
      (b.status !== "partial" && r.answers[0]?.points !== 100) ||
      r.answers.some(
        (a, i) =>
          !a.text?.trim() ||
          ![100, 64, 32, 16, 8, 4].includes(a.points) ||
          (i > 0 && a.points >= 100) ||
          (i > 0 && a.points > r.answers[i - 1].points),
      )
    )
      fail(file);
  }
  records[b.date] = b;
}
const output = await mkdtemp(".build-");
async function save(file, content) {
  const dst = output + "/" + file;
  await mkdir(dst.slice(0, dst.lastIndexOf("/")), { recursive: true });
  await writeFile(dst, content);
}
await cp("assets", output + "/assets", { recursive: true });
await cp("llms.txt", output + "/llms.txt");
const urls = ["/"];
async function page(path, html, index = true) {
  await save(path.slice(1) + "index.html", html);
  if (index && path !== "/") urls.push(path);
}
await page("/", puzzle(today, records[today]));
for (const [slug, g] of Object.entries(guides)) {
  const path = "/" + slug + "/";
  await page(
    path,
    layout(
      path,
      g.title + " | Noillirk Answers",
      g.description,
      '<article class="page"><h1>' +
        esc(g.title) +
        "</h1>" +
        g.html +
        "</article>",
    ),
  );
}
const verified = Object.values(records).filter((b) => b.status === "verified");
for (const b of Object.values(records))
  await page(
    "/answers/" + b.date + "/",
    puzzle(b.date, b, true),
    b.date < today && b.status === "verified",
  );
function archive(date) {
  const past = Object.values(records).filter((b) => b.date < date);
  const months = Object.groupBy(past, (b) => b.date.slice(0, 7));
  const entries = Object.values(months)
    .map(
      (group) =>
        "<section><h2>" +
        new Date(group[0].date + "T00:00Z").toLocaleString("en-US", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }) +
        "</h2>" +
        group
          .map(
            (b) =>
              `<p data-query="${esc([b.date, longDate(b.date), ...b.rounds.map((r) => r.question)].join(" ").toLowerCase())}"><a href="/answers/${b.date}/">${longDate(b.date)}</a> · 7 rounds · ${b.status === "verified" ? "Verified" : b.status === "partial" ? "Partially verified" : "Third-party report"}</p>`,
          )
          .join("") +
        "</section>",
    )
    .join("");
  return layout(
    "/archive/",
    "Noillirk Answer Archive",
    "Find dated daily answer sheets by month or question.",
    `<section class="page"><h1>Answer archive</h1><p>Find a past PlayDaily climb by date or question.</p>${past.length ? '<label>Search editions<input id="search" type="search" placeholder="Date or words from a prompt"></label><p id="matches" aria-live="polite"></p>' + entries : "<h2>Awaiting the first verified edition</h2><p>Each archived climb includes seven prompts, hints, scored answers and its source.</p>"}<p><a href="/">Open today’s sheet</a></p></section>`,
  );
}
await page("/archive/", archive(today));
await save(
  "404.html",
  layout(
    "/404.html",
    "Page not found",
    "This sheet is unavailable.",
    '<section class="page"><h1>Sheet unavailable</h1><p><a href="/archive/">Browse the answer archive</a></p></section>',
    true,
  ),
);
await save(
  "robots.txt",
  "User-agent: *\nAllow: /\nSitemap: " + origin + "/sitemap.xml\n",
);
function sitemap(paths) {
  return (
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    paths.map((p) => "<url><loc>" + origin + p + "</loc></url>").join("") +
    "</urlset>"
  );
}
await save("sitemap.xml", sitemap(urls));
await save(
  "_redirects",
  ["today", "answer", "answers"]
    .flatMap((p) => ["/" + p + " / 301", "/" + p + "/ / 301"])
    .join("\n"),
);
const token = "2099-12-31";
const pending = puzzle(token, null);
const tomorrow = new Date(Date.parse(today) + 86400000)
  .toISOString()
  .slice(0, 10);
const fallback = {
  pending,
  archive: archive(tomorrow),
  sitemap: sitemap([
    ...new Set([...urls, ...verified.map((b) => "/answers/" + b.date + "/")]),
  ]),
};
await save(
  "_worker.js",
  `const built = ${JSON.stringify(today)};
const fallback = ${JSON.stringify(fallback)};
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const date = new Date().toISOString().slice(0, 10);
    if (["/today", "/answer", "/answers"].includes(path.replace(/\\/$/, ""))) {
      return Response.redirect(new URL("/", url), 301);
    }
    if (['/answers/' + date, '/answers/' + date + '/'].includes(path)) {
      return Response.redirect(new URL("/", url), 302);
    }
    const dynamicPaths = ["/", "/archive/", "/sitemap.xml"];
    if (!dynamicPaths.includes(path)) return env.ASSETS.fetch(request);
    if (date <= built) {
      const asset = await env.ASSETS.fetch(request);
      const response = new Response(asset.body, asset);
      response.headers.set("cache-control", "no-cache");
      return response;
    }
    const displayDate = new Date(date + "T00:00Z").toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric", timeZone: "UTC"
    });
    const pages = {
      "/": () => fallback.pending.replaceAll("${token}", date).replaceAll("${longDate(token)}", displayDate),
      "/archive/": () => fallback.archive,
      "/sitemap.xml": () => fallback.sitemap
    };
    return new Response(request.method === "HEAD" ? null : pages[path](), {
      headers: {"content-type": path.endsWith(".xml") ? "application/xml" : "text/html; charset=utf-8", "cache-control": "no-cache"}
    });
  }
};`,
);
await save("build-date.txt", today);
await mkdir("dist", { recursive: true });
await cp(output, "dist", { recursive: true, force: true });
// Remove stale dated pages when a board is withdrawn.
for (const dir of await readdir("dist/answers").catch(() => []))
  if (!records[dir])
    await rm("dist/answers/" + dir, { recursive: true, force: true });
await rm(output, { recursive: true });
console.log(
  `Built ${urls.length} indexable routes for ${today} UTC. ${verified.length} verified editions.`,
);
