import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "qa", "screenshots");
mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:3000";
const errors = [];

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[${vp.name}] console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[${vp.name}] pageerror: ${err.message}`));

  // Home
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/${vp.name}-00-home.png` });

  // Feed
  await page.goto(`${BASE}/feed/0`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const total = 10;
  for (let i = 0; i < total; i++) {
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${OUT}/${vp.name}-card-${String(i + 1).padStart(2, "0")}.png` });

    // Interactions on specific cards
    if (i === 1) {
      // Prediction card: click the correct option ("Recomputes attention over all of them")
      const correct = page.locator("button", { hasText: "Recomputes attention over all of them" });
      if (await correct.count()) {
        await correct.first().click();
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${OUT}/${vp.name}-card-02-answered.png` });
      }
    }

    if (i === 5) {
      // Simulation card: drag the query node toward "sat"
      try {
        const moved = await page.evaluate(() => {
          const svg = document.querySelector('svg[aria-label^="Interactive graph"]');
          if (!svg) return false;
          const ctm = svg.getScreenCTM();
          if (!ctm) return false;
          const map = (x, y) => ({ x: ctm.a * x + ctm.c * y + ctm.e, y: ctm.b * x + ctm.d * y + ctm.f });
          window.__drag = { a: map(50, 75), b: map(62, 25) };
          return true;
        });
        if (moved) {
          const { a, b } = await page.evaluate(() => window.__drag);
          await page.mouse.move(a.x, a.y);
          await page.mouse.down();
          await page.mouse.move(b.x, b.y, { steps: 12 });
          await page.mouse.up();
          await page.waitForTimeout(700);
          await page.screenshot({ path: `${OUT}/${vp.name}-card-06-dragged.png` });
        }
      } catch (e) {
        errors.push(`[${vp.name}] drag error: ${e.message}`);
      }
    }

    if (i === 8) {
      // Recall quiz: click correct
      const correct = page.locator("button", { hasText: "It recomputes Q/K/V for the whole conversation" });
      if (await correct.count()) {
        await correct.first().click();
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${OUT}/${vp.name}-card-09-answered.png` });
      }
    }

    // advance
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(700);
  }

  // End screen
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${vp.name}-end.png` });

  await page.close();
}

await browser.close();

console.log(errors.length ? `\nERRORS:\n${errors.join("\n")}` : "\nNo console/page errors detected.");