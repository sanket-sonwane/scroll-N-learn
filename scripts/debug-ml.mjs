import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

page.on("console", (msg) => {
  console.log("CONSOLE:", msg.type(), "|", String(msg.text()).slice(0, 160));
});
page.on("pageerror", (err) => {
  console.log("PAGEERROR:", String(err.message).slice(0, 240));
  try {
    console.log("STACK:", String(err.stack ?? "").split("\n").slice(0, 15).join(" | "));
  } catch {
    console.log("STACK: (none)");
  }
});

const dump = async (label) => {
  const info = await page.evaluate(() => ({
    body: (document.body?.innerText ?? "").replace(/\s+/g, " ").slice(0, 500),
    offsets: Array.from(document.querySelectorAll("[data-offset]")).map((e) => e.getAttribute("data-offset")),
  }));
  console.log(label, JSON.stringify(info));
};

// 1) RulesBreak attack card, then click run
await page.goto("http://localhost:3001/feed/ml-rules-break/2", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
await dump("CARD3-INITIAL:");
const run = page.getByRole("button", { name: "run attack" });
console.log("RUN COUNT:", await run.count());
if (await run.count()) {
  await run.click();
  await page.waitForTimeout(6000);
}
await dump("CARD3-AFTER-RUN:");

// 2) RulesBreak model card
await page.goto("http://localhost:3001/feed/ml-rules-break/4", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(9000);
await dump("CARD5-MODEL:");

// 3) ExampleStream labeled
await page.goto("http://localhost:3001/feed/ml-learning-data/2", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(7000);
await dump("DATA-CARD3:");

// 4) ExampleStream noise
await page.goto("http://localhost:3001/feed/ml-learning-data/4", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1500);
const slider = page.locator('input[type="range"]');
console.log("SLIDER COUNT:", await slider.count());
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
  await page.waitForTimeout(1200);
}
await dump("DATA-CARD5-NOISY:");

await browser.close();