if (window.location.origin === "https://noillirkanswers.app") {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const tag = document.createElement("script");
  tag.async = true;
  tag.src = "https://www.googletagmanager.com/gtm.js?id=GTM-5MGNZDBD";
  document.head.appendChild(tag);
}

const answers = [...document.querySelectorAll("details.answer")];
const reveal = document.querySelector("#reveal-all");
const dialog = document.querySelector("dialog");
function update() {
  const n = answers.filter((el) => el.open).length;
  document.querySelector("#count").textContent = n + " / " + answers.length;
  document.querySelector(".meter i").style.width =
    (100 * n) / answers.length + "%";
  reveal.querySelector("span").textContent =
    n === answers.length ? "Hide all" : "Reveal all";
  answers.forEach((el) => {
    document
      .querySelector('.numbers a[href="#' + el.closest("article").id + '"]')
      .classList.toggle("seen", el.open);
    el.closest("article").querySelector(".state span").textContent = el.open
      ? "Revealed"
      : "Hidden";
  });
}
answers.forEach((el) => el.addEventListener("toggle", update));
reveal?.addEventListener("click", () => {
  if (answers.every((el) => el.open))
    document
      .querySelectorAll(".card details")
      .forEach((el) => (el.open = false));
  else dialog.showModal();
});
dialog?.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.submitter?.value === "reveal")
    answers.forEach((el) => (el.open = true));
  dialog.close();
});
document.querySelectorAll("[data-copy]").forEach((btn) =>
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = "Copied";
    } catch {
      btn.textContent = "Select answer to copy";
    }
    document.querySelector("#feedback").textContent = btn.textContent;
  }),
);
const filter = document.querySelector("#search");
filter?.addEventListener("input", () => {
  let hits = 0;
  document.querySelectorAll("[data-query]").forEach((el) => {
    el.hidden = !el.dataset.query.includes(filter.value.trim().toLowerCase());
    if (!el.hidden) hits++;
  });
  document.querySelector("#matches").textContent = hits + " matching editions";
});
const edition = document.querySelector("[data-daily]");
if (edition) {
  const opened = new Date().toISOString().slice(0, 10);
  function refreshDay() {
    if (new Date().toISOString().slice(0, 10) !== opened) location.reload();
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshDay();
  });
  setInterval(refreshDay, 60000);
}
