// Check the built Pages handler at both sides of the UTC reset.
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import worker from "../dist/_worker.js";
import { esc } from "../render.mjs";

const root = new URL("../dist/", import.meta.url);
const origin = "https://noillirkanswers.app";
const env = {
  ASSETS: {
    async fetch(req) {
      let path = new URL(req.url).pathname.slice(1);
      if (!path || path.endsWith("/")) path += "index.html";
      return new Response(await readFile(new URL(path, root)));
    },
  },
};
const request = (path) => worker.fetch(new Request(origin + path), env);
const built = await readFile(new URL("build-date.txt", root), "utf8");
const NativeDate = Date;
function setTime(instant) {
  globalThis.Date = class extends NativeDate {
    constructor(...args) {
      super(...(args.length ? args : [instant]));
    }
  };
}

try {
  setTime(built + "T23:59:59Z");
  const home = await (await request("/")).text();
  assert.equal((home.match(/class="card"/g) || []).length, 7);
  for (const alias of ["/today/", "/answer/", "/answers/"]) {
    const response = await request(alias);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), origin + "/");
  }
  assert.equal((await request("/answers/" + built + "/")).status, 302);

  const nextMidnight = new NativeDate(NativeDate.parse(built) + 86400000);
  setTime(nextMidnight);
  const nextHome = await (await request("/")).text();
  assert(
    nextHome.includes(
      'data-daily="' + nextMidnight.toISOString().slice(0, 10) + '"',
    ),
  );
  assert(nextHome.includes("awaiting verification"));
  const xml = await (await request("/sitemap.xml")).text();
  const archive = await (await request("/archive/")).text();
  for (const file of await readdir(new URL("../data/", import.meta.url))) {
    if (!file.endsWith(".json")) continue;
    const board = JSON.parse(
      await readFile(new URL("../data/" + file, import.meta.url)),
    );
    const path = "/answers/" + board.date + "/";
    const html = await (await request(path)).text();
    assert(archive.includes(path));
    assert.equal((html.match(/class="card"/g) || []).length, 7);
    // Check the actual delivered markup, including today's home page when available.
    for (const sheet of board.date === built ? [home, html] : [html]) {
      const cards = [
        ...sheet.matchAll(
          /<article id="round-\d+" class="card">([\s\S]*?)<\/article>/g,
        ),
      ];
      assert.equal(cards.length, board.rounds.length);
      for (const [i, round] of board.rounds.entries()) {
        const card = cards[i][1];
        assert(card.includes("<h3>" + esc(round.question) + "</h3>"));
        assert(card.includes(esc(round.hint)));
        assert(!/<details\b[^>]*\sopen\b/.test(card));
        const best = round.answers[0];
        if (!best) {
          assert(card.includes("Answer pending"));
          continue;
        }
        const label = best.points === 100 ? "Top answer" : "Confirmed answer";
        assert(
          card.includes(
            label +
              "<br><strong>" +
              esc(best.text) +
              "</strong> · " +
              best.points +
              " pts",
          ),
        );
        for (const alternative of round.answers.slice(1)) {
          assert(
            card.includes(
              esc(alternative.text) + " <b>" + alternative.points + " pts</b>",
            ),
          );
        }
      }
    }
    assert.equal(xml.includes(origin + path), board.status === "verified");
    assert.equal(
      html.includes('content="noindex"'),
      board.status !== "verified",
    );
  }
  console.log(
    "Daily sheet, redirects, UTC rollover, archive and indexing checks passed.",
  );
} finally {
  globalThis.Date = NativeDate;
}
