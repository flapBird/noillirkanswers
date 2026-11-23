import { icon } from "./icons.mjs";
import { practice } from "./practice.mjs";

export const origin = "https://noillirkanswers.app";
const game = "https://playdaily.org/noillirk";
export const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ],
  );
const fmt = (date, opts) =>
  new Date(date + "T00:00:00Z").toLocaleDateString("en-US", {
    timeZone: "UTC",
    ...opts,
  });
export const longDate = (date) =>
  fmt(date, { month: "long", day: "numeric", year: "numeric" });
const nav = [
  ["/", "Today"],
  ["/archive/", "Archive"],
  ["/hints/", "Hints"],
  ["/how-to-play/", "How to play"],
];
export function layout(path, title, description, body, noindex = false) {
  const canonical = origin + path;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><link rel="canonical" href="${canonical}">${noindex ? '<meta name="robots" content="noindex">' : ""}<link rel="icon" href="/assets/mark.png"><link rel="stylesheet" href="/assets/site.css"><script defer src="/assets/site.js"></script></head><body><a class="skip" href="#main">Skip to content</a><header><div class="wrap bar"><a class="brand" href="/"><img src="/assets/mark.png" alt="">Noillirk <span>Answers</span></a><nav aria-label="Main navigation">${nav.map(([url, label]) => `<a ${path === url ? 'aria-current="page"' : ""} href="${url}">${label}</a>`).join("")}</nav><a class="play" href="${game}">${icon("game")} Play Noillirk</a></div></header><main id="main" class="wrap">${body}</main><footer><div class="wrap"><b>Noillirk Answers</b><span>Independent guide to the PlayDaily edition.</span><a href="/krillion-vs-noillirk/">Krillion vs Noillirk</a></div></footer></body></html>`;
}
const tiers = [
  ["Sky High", 100, "#e5bc50"],
  ["Jet Stream", 64, "#dd797e"],
  ["Cloud Nine", 32, "#e7a066"],
  ["Kite", 16, "#a6c66e"],
  ["Treetop", 8, "#82ade7"],
  ["Grounded", 4, "#b4afb8"],
];
function tracker(rounds) {
  const total = rounds.filter(round => round.answers.length).length;
  return `<section class="ticket" aria-label="Round navigator"><div class="ticket-head"><h2>Round navigator</h2>${icon("layers")}</div><div class="numbers">${rounds.map((_, i) => `<a href="#round-${i+1}" aria-label="Go to round ${i+1}">${i+1}</a>`).join("")}</div><div class="ticket-foot"><span>Answers revealed</span><b id="count">0 / ${total}</b><div class="meter"><i></i></div></div></section>`;
}
function aside() {
  return `<aside><section class="panel"><h2>${icon("trophy")} Score guide</h2>${tiers.map(([name, score, color]) => `<div class="tier"><span><i style="background:${color}"></i>${name}</span><b>${score} <small>pts</small></b></div>`).join("")}<a class="more" href="/how-to-play/">How scoring works</a></section><section class="panel"><h2>${icon("calendar")} Past editions</h2><p class="sub">Look up a previous climb by date or by words from a question.</p><a class="more" href="/archive/">Browse answer archive</a></section></aside>`;
}
function card(r, i, status) {
  const best = r.answers[0];
  const letters = Array.from(best?.text || "").filter((c) => /\p{L}/u.test(c));
  const spelling = best
    ? `<details><summary>First letter &amp; length</summary><p>Starts with <b>${esc(letters[0])}</b> · ${letters.length} letters</p></details>`
    : "";
  const alternatives = r.answers
    .slice(1)
    .map(
      (a) =>
        `<div class="alt">${esc(a.text)} ${a.points != null ? `<b>${a.points} pts</b>` : ""}</div>`,
    )
    .join("");
  const pendingTop =
    status === "partial" && best && best.points < 100
      ? '<p class="sub">The 100-point answer for this round is still unconfirmed.</p>'
      : "";
  const answer = best
    ? `<details class="answer"><summary>${icon("eye")} Reveal answer</summary><div class="disclosure">${best.points != null ? (best.points === 100 ? "Top answer" : "Confirmed answer") + "<br>" : ""}<strong>${esc(best.text)}</strong> ${best.points != null ? `· ${best.points} pts` : ""}<button class="copy" data-copy="${esc(best.text)}">Copy</button>${pendingTop}${alternatives}</div></details>`
    : "";
  return `<article id="round-${i + 1}" class="card"><div class="card-head"><b class="round"><span class="sr">Round </span>${String(i + 1).padStart(2, "0")}</b><span class="state">${icon(best ? "lock" : "clock")} <span>${best ? "Hidden" : "Answer pending"}</span></span></div><h3>${esc(r.question)}</h3><div class="actions"><details class="hint"><summary>${icon("bulb")} Hint</summary><div class="disclosure">${esc(r.hint)}${spelling}</div></details>${answer}</div></article>`;
}
export function puzzle(date, record, archived = false) {
  const rounds = record?.rounds ?? practice,
    status = record?.status,
    path = archived ? `/answers/${date}/` : "/";
  const subtitle = record
    ? "Seven rounds. Start with a hint, or reveal the answer and its score."
    : "Today’s answers are awaiting verification. Try the practice sheet below.";
  const answerCount = rounds.reduce(
    (sum, round) => sum + round.answers.length,
    0,
  );
  const topCount = rounds.filter(
    (round) => round.answers[0]?.points === 100,
  ).length;
  const dateLabel = longDate(date);
  let description;
  if (!record) {
    description = `Noillirk answers for ${dateLabel} are awaiting verification. Try seven practice rounds with hints, or browse past puzzles while you wait for the daily answers.`;
  } else if (status === "reported") {
    description = `Explore the Noillirk puzzle for ${dateLabel}. Get hints for all 7 rounds and compare reported answers and scores from a third-party source.`;
  } else if (answerCount === 0) {
    description = `Get Noillirk hints for ${dateLabel}. Explore all 7 daily questions one round at a time while their answers and scores await verification.`;
  } else {
    const picks =
      answerCount === 1
        ? "1 confirmed answer and its score"
        : `${answerCount} confirmed answers and their scores`;
    const topPicks = topCount ? `, including ${topCount} worth 100 points` : "";
    description = `Find Noillirk answers for ${dateLabel}. Try hints for all 7 rounds, then reveal ${picks}${topPicks}.`;
  }
  const labels = {
    verified: "Verified PlayDaily answers",
    partial: `PlayDaily · ${topCount} of 7 top answers confirmed`,
    reported: "Third-party reported answers · awaiting official confirmation",
  };
  const title = archived
    ? "Archived answers"
    : "Today’s Noillirk<br><em>answer sheet.</em>";
  const heading = record
    ? archived
      ? "Archived rounds"
      : "Round by round"
    : "Practice rounds";
  return layout(
    path,
    `Noillirk Answers ${archived ? "" : "Today "}– ${longDate(date)} | Hints & Scores`,
    description,
    `
 <section class="hero" ${archived ? "" : 'data-daily="' + date + '"'}>${tracker(rounds)}<div class="hero-inner"><span class="edition">${icon("calendar")} ${longDate(date)} <small>UTC</small></span><h1>${title}</h1><p>${subtitle}</p></div></section>
 <div class="board"><section><div class="list-head"><h2>${heading}</h2><button id="reveal-all">${icon("eye")} <span>Reveal all</span></button></div><p class="sub">${record ? labels[status] : "Original examples · suggested answers"}</p>${rounds.map((round, i) => card(round, i, status)).join("")}${record ? `<p class="source">Checked ${esc(record.checkedAt)} · <a href="${esc(record.source)}">View board source</a></p>` : ""}</section>${aside()}</div><dialog><h2>Reveal all available answers?</h2><p>This opens every answer on this sheet.</p><form method="dialog"><button value="cancel">Keep hidden</button><button value="reveal">Reveal answers</button></form></dialog><span id="feedback" class="sr" aria-live="polite"></span>`,
    archived && status !== "verified",
  );
}
