// sessionLogin-browser.js
import puppeteer from 'puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js';
import fs from 'fs/promises';
import path from 'path';

// Replace this with the WebSocket URL of your running Chrome
const wsUrl = "ws://127.0.0.1:9222/devtools/browser/7288a2ef-45f5-4442-85e7-59c7bec880e6";

// Path to store/load cookies
const cookiesPath = path.resolve('./cookies.json');

(async () => {
  let browser;
  try {
    // Connect to the running Chrome instance
    browser = await puppeteer.connect({ browserWSEndpoint: wsUrl });
    console.log("🚀 Connected to browser");

    // Get first open page or create a new one
    let [page] = await browser.pages();
    if (!page) {
      page = await browser.newPage();
    }

    // Navigate to the dashboard page
    console.log("🌐 Navigating to dashboard...");
    await page.goto("https://central.axxessweb.com/help", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    console.log("✅ Page loaded successfully!");

    // Load cookies from file if available
    try {
      const raw = await fs.readFile(cookiesPath, 'utf-8');
      const cookies = JSON.parse(raw);
      if (cookies.length > 0) {
        await page.setCookie(...cookies);
        console.log("🍪 Cookies restored from file");
      }
    } catch (err) {
      console.log("⚠️ No cookies found or failed to load:", err.message);
    }

    // Wait for the Home Health button and click it
    const homeHealth = await page.waitForSelector(
      ".au-target.btn.btn-axxess.btn-block.Home.Health.font-size-base",
      { timeout: 15000 }
    );
    await homeHealth.click();
    console.log("✅ Clicked Home Health button!");

  } catch (err) {
    console.error("⚠️ Error during automation:", err.message);
  } finally {
    if (browser) {
      browser.disconnect(); // disconnect but leave Chrome open
      console.log("🔌 Browser disconnected");
    }
  }
})().catch(err => {
  console.error("🔥 Fatal error:", err);
});

// Optional: catch any unhandled rejections globally
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});
