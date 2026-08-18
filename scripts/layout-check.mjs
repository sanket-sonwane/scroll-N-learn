import { chromium } from "playwright";

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

  // Feed checks across all cards
  await page.goto(`${BASE}/feed/0`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);

  const total = 10;
  for (let i = 0; i < total; i++) {
    await page.waitForTimeout(1500);
    const m = await page.evaluate(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const issues = [];

      // horizontal overflow
      if (document.documentElement.scrollWidth > vw + 1) {
        issues.push("hOverflow");
      }

      // any element sticking past the right or bottom edge that is text/visible
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

    if (m.issues.length) problems.push(`[${vp.name}] card ${i + 1}: ${m.issues.join(",")}`);
    if (m.offenders.length) {
      problems.push(`[${vp.name}] card ${i + 1}: ${m.offenders.slice(0, 6).join(" | ")}`);
    }

    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(600);
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
  if (end.hOverflow) problems.push(`[${vp.name}] end: horizontal overflow`);
  if (end.clipped) problems.push(`[${vp.name}] end: content clipped`);

  await page.close();
}

await browser.close();

console.log(
  problems.length
    ? `LAYOUT PROBLEMS:\n${problems.join("\n")}`
    : "Layout check passed on all viewports and cards.",
);