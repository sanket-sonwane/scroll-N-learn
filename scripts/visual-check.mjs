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

  const experiences = [
    { id: "algorithms-complexity", slug: "complexity", total: 10 },
    { id: "algorithms-execution", slug: "execution", total: 11 },
    { id: "algorithms-break", slug: "break", total: 9 },
    { id: "algorithms-graph", slug: "graph", total: 12 },
  ];

  for (const exp of experiences) {
    await page.goto(`${BASE}/feed/${exp.id}/0`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);

    for (let i = 0; i < exp.total; i++) {
      await page.waitForTimeout(1500);
      const pad = String(i + 1).padStart(2, "0");
      await page.screenshot({ path: `${OUT}/${vp.name}-${exp.slug}-${pad}.png` });

      // --- Experience A: Complexity Race ---
      if (exp.slug === "complexity") {
        if (i === 1) {
          // Interactive slider: push input size to 100
          const slider = page.locator('[data-offset="0"]').locator('input[type="range"]');
          if (await slider.count()) {
            await slider.evaluate((el) => {
              el.value = "100";
              el.dispatchEvent(new Event("input", { bubbles: true }));
            });
            await page.waitForTimeout(600);
            await page.screenshot({ path: `${OUT}/${vp.name}-complexity-02-slider100.png` });
          } else {
            errors.push(`[${vp.name}] complexity card 2: slider not found`);
          }
        }
        if (i === 6) {
          // Drag-to-rank: pull O(n!) from the bottom to the top
          try {
            const row = page
              .locator('[data-offset="0"]')
              .locator('div[class*="cursor-grab"]')
              .filter({ hasText: "O(n!)" })
              .first();
            if (await row.count()) {
              const box = await row.boundingBox();
              if (box) {
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                await page.mouse.down();
                await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 230, { steps: 14 });
                await page.mouse.up();
                await page.waitForTimeout(500);
                await page.screenshot({ path: `${OUT}/${vp.name}-complexity-07-reordered.png` });
              }
              await page.getByRole("button", { name: "check order" }).click();
              await page.waitForTimeout(700);
              await page.screenshot({ path: `${OUT}/${vp.name}-complexity-07-checked.png` });
              await page.getByRole("button", { name: "show answer" }).click();
              await page.waitForTimeout(500);
            } else {
              errors.push(`[${vp.name}] complexity card 7: rank row not found`);
            }
          } catch (e) {
            errors.push(`[${vp.name}] complexity rank error: ${e.message}`);
          }
        }
        if (i === 7) {
          // Prediction: pick the scalable option
          const correct = page.locator('[data-offset="0"]').locator("button", { hasText: "O(n log n)" });
          if (await correct.count()) {
            await correct.first().click();
            await page.waitForTimeout(800);
            await page.screenshot({ path: `${OUT}/${vp.name}-complexity-08-answered.png` });
          }
        }
      }

      // --- Experience B: Algorithm Execution ---
      if (exp.slug === "execution" && i === 10) {
        // Custom input: run the algorithm on the user's array
        const input = page.locator('[data-offset="0"]').locator('input[id^="array-"]');
        if (await input.count()) {
          await input.fill("1,5,2,9,3");
          await page.locator('[data-offset="0"]').getByRole("button", { name: "run it" }).click();
          await page.waitForTimeout(700);
          await page.screenshot({ path: `${OUT}/${vp.name}-execution-11-custom.png` });
        }
      }

      // --- Experience C: Break the Algorithm ---
      if (exp.slug === "break" && i === 2) {
        // Counterexample hunt: pick the all-negative array
        const breaker = page.locator('[data-offset="0"]').locator("button", { hasText: "-2  -5  -1  -8" });
        if (await breaker.count()) {
          await breaker.first().click();
          await page.waitForTimeout(900);
          await page.screenshot({ path: `${OUT}/${vp.name}-break-03-broke.png` });
          const broke = await page.locator('[data-offset="0"]').getByText("You broke it.").count();
          if (!broke) errors.push(`[${vp.name}] break card 3: 'You broke it' not shown`);
          const fix = page.locator('[data-offset="0"]').getByRole("button", { name: "Fix it" });
          if (await fix.count()) {
            await fix.click();
            await page.waitForTimeout(700);
            await page.screenshot({ path: `${OUT}/${vp.name}-break-03-fixed.png` });
          }
        } else {
          errors.push(`[${vp.name}] break card 3: counterexample button not found`);
        }
      }

      // --- Experience D: Graph Puzzles ---
      if (exp.slug === "graph") {
        if (i === 1) {
          // Vertex cover: select A and D to cover all edges minimally
          const nodes = page.locator('[data-offset="0"]').locator("circle.cursor-pointer");
          if ((await nodes.count()) >= 4) {
            await nodes.nth(0).click(); // A
            await page.waitForTimeout(350);
            await nodes.nth(3).click(); // D
            await page.waitForTimeout(700);
            await page.screenshot({ path: `${OUT}/${vp.name}-graph-02-cover.png` });
          } else {
            errors.push(`[${vp.name}] graph card 2: vertex nodes not found`);
          }
        }
        if (i === 6) {
          // Hamiltonian: draw A→B→C→D→E→F→A
          const nodes = page.locator('[data-offset="0"]').locator("circle.cursor-pointer");
          if ((await nodes.count()) >= 6) {
            const order = [0, 1, 2, 3, 4, 5, 0];
            for (const n of order) {
              await nodes.nth(n).click({ force: true });
              await page.waitForTimeout(250);
            }
            await page.waitForTimeout(600);
            await page.screenshot({ path: `${OUT}/${vp.name}-graph-07-cycle.png` });
          } else {
            errors.push(`[${vp.name}] graph card 7: hamiltonian nodes not found`);
          }
        }
        if (i === 7) {
          // Invalid move: A → B → B (revisit)
          const nodes = page.locator('[data-offset="0"]').locator("circle.cursor-pointer");
          if ((await nodes.count()) >= 2) {
            await nodes.nth(0).click({ force: true });
            await page.waitForTimeout(250);
            await nodes.nth(1).click({ force: true });
            await page.waitForTimeout(250);
            await nodes.nth(0).click({ force: true });
            await page.waitForTimeout(700);
            await page.screenshot({ path: `${OUT}/${vp.name}-graph-08-invalid.png` });
            const invalid = await page.locator('[data-offset="0"]').getByText("You already visited this vertex.").count();
            if (!invalid) errors.push(`[${vp.name}] graph card 8: invalid-move feedback not shown`);
          }
        }
      }

      // advance
      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(700);
    }

    // End screen
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${vp.name}-${exp.slug}-end.png` });
  }

  await page.close();
}

await browser.close();

console.log(errors.length ? `\nERRORS:\n${errors.join("\n")}` : "\nNo console/page errors detected.");