import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const read = (p) =>
  JSON.parse(
    readFileSync(resolve(__dirname, "..", "content", "tracks", "algorithms", p), "utf8"),
  );

const experiences = [
  read("complexity-race.json"),
  read("algorithm-execution.json"),
  read("break-the-algorithm.json"),
  read("graph-puzzle.json"),
];

const BASE = "http://localhost:3000";
const problems = [];

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "mobile-short", width: 375, height: 667 },
  { name: "desktop", width: 1440, height: 900 },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`[${vp.name}] console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`[${vp.name}] pageerror: ${err.message}`));

  // Home page checks
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const home = await page.evaluate(() => {
    const out = { hOverflow: document.documentElement.scrollWidth > window.innerWidth };
    const main = document.querySelector("main");
    if (main) {
      const r = main.getBoundingClientRect();
      out.inside = r.top >= -1 && r.bottom <= window.innerHeight + 1;
    }
    return out;
  });
  if (home.hOverflow) problems.push(`[${vp.name}] home: horizontal overflow`);
  if (!home.inside) problems.push(`[${vp.name}] home: main content clipped`);

  for (const exp of experiences) {
    const total = exp.cards.length;

    // Feed checks across all cards of this experience
    await page.goto(`${BASE}/feed/${exp.id}/0`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1400);

    for (let i = 0; i < total; i++) {
      await page.waitForTimeout(1600);
      const m = await page.evaluate(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const issues = [];

        if (document.documentElement.scrollWidth > vw + 1) issues.push("hOverflow");

        const offenders = [];
        document.querySelectorAll("p, h1, h2, h3, span, button, li").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return;
          const style = getComputedStyle(el);
          if (style.visibility === "hidden" || style.display === "none" || style.opacity === "0") return;
          if (r.right > vw + 2) offenders.push(`right:${el.textContent.slice(0, 24)}`);
          if (r.bottom > vh + 2 && r.top < vh - 60) offenders.push(`bottomClip:${el.textContent.slice(0, 24)}`);
          if (r.left < -2) offenders.push(`left:${el.textContent.slice(0, 24)}`);
        });
        return { issues, offenders };
      });

      if (m.issues.length) problems.push(`[${vp.name}] ${exp.id} card ${i + 1}: ${m.issues.join(",")}`);
      if (m.offenders.length) {
        problems.push(`[${vp.name}] ${exp.id} card ${i + 1}: ${m.offenders.slice(0, 6).join(" | ")}`);
      }

      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(650);
    }

    // End screen
    await page.waitForTimeout(800);
    const end = await page.evaluate(() => {
      return {
        hOverflow: document.documentElement.scrollWidth > window.innerWidth,
        clipped: [...document.querySelectorAll("h2, p, button")].some((el) => {
          const r = el.getBoundingClientRect();
          return r.bottom > window.innerHeight + 2 && r.top < window.innerHeight - 80;
        }),
      };
    });
    if (end.hOverflow) problems.push(`[${vp.name}] ${exp.id} end: horizontal overflow`);
    if (end.clipped) problems.push(`[${vp.name}] ${exp.id} end: content clipped`);

    // Dwell red-flag: cards that were dwelled on for less than 1.2s indicate
    // a crash or a too-fast-skimming card. We paced each card at ~1.6s+0.65s.
    const dwell = await page.evaluate(() => {
      const raw = localStorage.getItem("scrolllearn:events:v0");
      if (!raw) return {};
      const evts = JSON.parse(raw).filter((e) => e.type === "card_enter" || e.type === "card_exit");
      const enters = {};
      const exits = {};
      for (const e of evts) {
        if (e.type === "card_enter") enters[e.index] = e.ts;
        else exits[e.index] = e.ts;
      }
      const out = {};
      for (const k of Object.keys(enters)) if (exits[k]) out[k] = exits[k] - enters[k];
      return out;
    });
    for (const idx of Object.keys(dwell)) {
      if (dwell[idx] < 1200) {
        problems.push(`[${vp.name}] ${exp.id} card ${Number(idx) + 1}: dwell too short (${dwell[idx]}ms)`);
      }
    }

    // Clear analytics so the next experience pass starts clean
    await page.evaluate(() => localStorage.clear());
  }

  await page.close();
}

await browser.close();

console.log(
  problems.length
    ? `LAYOUT PROBLEMS:\n${problems.join("\n")}`
    : "Layout check passed on all viewports and cards.",
);