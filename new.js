import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const COOKIES_PATH = path.resolve('./cookies.json');
const Browser_ID ='cf9f6a30-2b59-479b-bcac-40fa88d58038'

async function runPuppeteer() {
  try {
    const wsUrl =
      `ws://127.0.0.1:9222/devtools/browser/${Browser_ID}`;
    const browser = await puppeteer.connect({ browserWSEndpoint: wsUrl });

    const page = await browser.newPage();
    await page.setViewport({
      width: 2000,
      height: 900,
      deviceScaleFactor: 2, // Retina display
    });

    // ---- Inject cookies if available ----
    if (fs.existsSync(COOKIES_PATH)) {
      let cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
      cookies = cookies.map(
        ({ name, value, domain, path, httpOnly, secure, sameSite }) => ({
          name,
          value,
          domain: domain?.startsWith('.') ? domain : '.' + domain,
          path: path || '/',
          httpOnly: !!httpOnly,
          secure: !!secure,
          sameSite: sameSite || 'Lax',
        })
      );
      await page.setCookie(...cookies);
      console.log('🍪 Cookies injected before navigation');
    }

    // ---- Navigate to dashboard ----
    await page.goto('https://central.axxessweb.com/help', {
      waitUntil: 'networkidle2',
      timeout: 120000,
    });
    console.log('✅ Page opened with cookies applied');

    // ---- Step 1: Click Home Health ----
    const homeHealth = await page.waitForSelector(
      '.au-target.btn.btn-axxess.btn-block.Home.Health.font-size-base',
      { visible: true, timeout: 120000 }
    );
    const homeHealthHtml = await page.evaluate(el => el.outerHTML, homeHealth);
    console.log("🔍 Home Health Button HTML:", homeHealthHtml);
    await homeHealth.click();
    console.log("✅ HNTS button clicked!");


    await page.waitForNetworkIdle({ timeout: 120000 });

    console.log("moving");
    // ---- Step 2: Click Patient (header icon) ----
    const patient = await page.waitForSelector(
      'ul#app-expanded-menu li.menu span',
      { visible: true, timeout: 120000 }
    );
    const patientHtml = await page.evaluate(el => el.outerHTML, patient);
    console.log("🔍 Patient Icon HTML:", patientHtml);
    await patient.click();
    console.log("✅ Patient icon clicked!");

    // ---- Step 3: Click Patient Charts from dropdown ----
    const patientCharts = await page.evaluateHandle(() => {
      const items = document.querySelectorAll('ul.menu-list.right-list div.menu-item');
      return Array.from(items).find(el =>
        el.innerText.trim().includes("Patient Charts")
      );
    });
    if (patientCharts) {
      const chartsHtml = await page.evaluate(el => el.outerHTML, patientCharts);
      console.log("🔍 Patient Charts menu HTML:", chartsHtml);
      await patientCharts.click();
      console.log("✅ Patient Charts clicked!");
      await page.waitForNetworkIdle({ timeout: 120000 });
    } else {
      console.log("❌ Patient Charts option not found");
    }

    // ---- Step 4: Search Patient ----
    const searchInput = await page.waitForSelector(
      'input[placeholder="Search Patients"]',
      { visible: true, timeout: 120000 }
    );
    const inputHtml = await page.evaluate(el => el.outerHTML, searchInput);
    console.log("🔍 Search Input HTML:", inputHtml);

    // Clear the input
    await searchInput.click({ clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.evaluate(el => el.value = "", searchInput);
    const clearedValue = await page.evaluate(el => el.value, searchInput);
    console.log("🧹 Cleared search input, current value:", clearedValue);

    // Type new value
    await searchInput.type("AGUILAR, MARY E", { delay: 100 });
    const typedValue = await page.evaluate(el => el.value, searchInput);
    console.log("✅ Typed into search input, current value:", typedValue);

    console.log('🎯 Flow complete, patient searched');

    // ---- Disconnect but keep Chrome alive ----
    await browser.disconnect();
  } catch (err) {
    console.error('❌ Error in Puppeteer script:', err);
  }
}

runPuppeteer();


// /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
// --remote-debugging-port=9222 \
// --user-data-dir="$HOME/Library/Application Support/Google/Chrome/Profile 6"