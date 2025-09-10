import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const COOKIES_PATH = path.resolve('./cookies.json');
// const LOCALSTORAGE_PATH = path.resolve('./localstorage.json'); // optional

async function runPuppeteer() {
  try {
    const wsUrl =
      'ws://127.0.0.1:9222/devtools/browser/7bfacf29-169c-486b-b492-ba0f14f20c69'; // replace with your ws
    const browser = await puppeteer.connect({ browserWSEndpoint: wsUrl });

    const page = await browser.newPage();


    if (fs.existsSync(COOKIES_PATH)) {
      let cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));

      // ✅ sanitize cookies
      cookies = cookies.map(
        ({ name, value, domain, path, httpOnly, secure, sameSite }) => ({
          name,
          value,
          domain: domain.startsWith('.') ? domain : '.' + domain,
          path: path || '/',
          httpOnly: !!httpOnly,
          secure: !!secure,
          sameSite: sameSite || 'Lax',
        })
      );

      await page.setCookie(...cookies);
      console.log('🍪 Cookies injected before navigation');
    }

    // ---- Navigate to site ----
    await page.goto('https://central.axxessweb.com/help', {
      waitUntil: 'networkidle2',
    });
    console.log('✅ Page opened with cookies applied');

    // ---- Restore localStorage if available ----
    // if (fs.existsSync(LOCALSTORAGE_PATH)) {
    //   const localStorageData = JSON.parse(
    //     fs.readFileSync(LOCALSTORAGE_PATH, 'utf-8')
    //   );
    //   await page.evaluate((data) => {
    //     for (const [key, value] of Object.entries(data)) {
    //       localStorage.setItem(key, value);
    //     }
    //   }, localStorageData);
    //   console.log('💾 localStorage restored');

    //   // reload to apply localStorage session
    //   await page.reload({ waitUntil: 'networkidle2' });
    //   console.log('🔄 Page reloaded with localStorage applied');
    // }

    // ---- Example: wait for a dashboard element ----
       const homeHealth = await page.waitForSelector(
        '.au-target.btn.btn-axxess.btn-block.Home.Health.font-size-base',
        { visible: true, timeout: 100000 }
    );
    await homeHealth.click();
    console.log("✅ HNTS button clicked!");

    const patient = await page.waitForSelector('.d-none.d-xl-block.fas.fa-user', { visible: true, timeout: 100000 });
    await patient.click();
    console.log("✅ Patient icon clicked!");
    const patientCharts = await page.waitForSelector('ul.menu-list.right-list div.menu-item:has-text("Patient Charts")', { visible: true, timeout: 100000 });
    await patientCharts.click();
    console.log("✅ Patient Charts clicked!");

    console.log('🎯 Dashboard is loaded & accessible');


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