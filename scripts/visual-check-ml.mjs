import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "qa", "screenshots");
mkdirSync(OUT, { recursive: true });

const BASE = process.env.QABASE ?? "http://localhost:3010";
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

  // ML track landing
  await page.goto(`${BASE}/track/ml`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/${vp.name}-ml-landing.png` });

  const experiences = [
    { id: "ml-rules-break", slug: "ml-rules", total: 8 },
    { id: "ml-learning-data", slug: "ml-data", total: 10 },
  ];

  for (const exp of experiences) {
    await page.goto(`${BASE}/feed/${exp.id}/0`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1400);

    for (let i = 0; i < exp.total; i++) {
      await page.waitForTimeout(1600);
      const pad = String(i + 1).padStart(2, "0");
      await page.screenshot({ path: `${OUT}/${vp.name}-${exp.slug}-${pad}.png` });

      // --- E1 card 3: rules attack ---
      if (exp.slug === "ml-rules") {
        if (i === 2) {
          const run = page.locator('[data-offset="0"]').getByRole("button", { name: "run attack" });
          if (await run.count()) {
            await run.click();
            await page.waitForTimeout(5200);
            await page.screenshot({ path: `${OUT}/${vp.name}-ml-rules-03-attacked.png` });
            const slipped = await page.locator('[data-offset="0"]').getByText(/slipped/).count();
            if (!slipped) errors.push(`[${vp.name}] ml-rules card 3: slipped counter not shown`);
          } else {
            errors.push(`[${vp.name}] ml-rules card 3: run attack button not found`);
          }
        }
        if (i === 4) {
          // comparison bars render only after the model stream completes (~7.5s)
          let scorebar = 0;
          for (let w = 0; w < 24; w++) {
            scorebar = await page
              .locator('[data-offset="0"]')
              .locator("div[class*='bg-surface-2']")
              .count();
            if (scorebar) break;
            await page.waitForTimeout(500);
          }
          await page.screenshot({ path: `${OUT}/${vp.name}-ml-rules-05-model.png` });
          if (!scorebar) errors.push(`[${vp.name}] ml-rules card 5: scorebars not found`);
        }
      }

      // --- E2 card 3: example stream; card 5: noise ---
      if (exp.slug === "ml-data") {
        if (i === 2) {
          await page.waitForTimeout(2200);
          await page.screenshot({ path: `${OUT}/${vp.name}-ml-data-03-stream.png` });
          const acc = await page
            .locator('[data-offset="0"]')
            .locator("div[class*='bg-gradient-to-r']")
            .count();
          if (!acc) errors.push(`[${vp.name}] ml-data card 3: accuracy meter not found`);
        }
        if (i === 4) {
          const slider = page.locator('[data-offset="0"]').locator('input[type="range"]');
          if (await slider.count()) {
            await slider.evaluate((el) => {
              const setter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value",
              ).set;
              setter.call(el, "30");
              el.dispatchEvent(new Event("input", { bubbles: true }));
              el.dispatchEvent(new Event("change", { bubbles: true }));
            });
            await page.waitForTimeout(900);
            await page.screenshot({ path: `${OUT}/${vp.name}-ml-data-05-noisy.png` });
            const noisy = await page.locator('[data-offset="0"]').getByText("30% mislabeled").count();
            if (!noisy) errors.push(`[${vp.name}] ml-data card 5: noise readout not shown`);
          } else {
            errors.push(`[${vp.name}] ml-data card 5: noise slider not found`);
          }
        }
      }

      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(750);
    }

    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${vp.name}-${exp.slug}-end.png` });
  }

  await page.close();
}

await browser.close();

console.log(errors.length ? `\nERRORS:\n${errors.join("\n")}` : "\nNo console/page errors detected.");