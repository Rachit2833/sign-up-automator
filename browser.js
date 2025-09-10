import puppeteer from "puppeteer";
import fs from "fs";

// Path to Chrome executable
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Path to your 6th profile
// Chrome profiles are usually like: "Profile 1", "Profile 2", ..., "Profile 6"
const USER_DATA_DIR = "/Users/rachit/Library/Application Support/Google/Chrome/Profile 5";

// Path to your cookies file
const COOKIES_PATH = "./cookies.json";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: CHROME_PATH,
        userDataDir: USER_DATA_DIR,
        defaultViewport: null,
        args: [
            "--start-maximized",
            "--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure",
            "--disable-web-security",
            "--disable-site-isolation-trials",
        ],
    });

    const page = await browser.newPage();

    // Load cookies from JSON if available
    if (fs.existsSync(COOKIES_PATH)) {
        const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, "utf-8"));
        await page.setCookie(...cookies);
        console.log("🍪 Cookies loaded from cookies.json");
    }

    // Go to your page
    await page.goto("https://central.axxessweb.com/help", { waitUntil: "networkidle2" });

    // Reload page to apply cookies
    await page.reload({ waitUntil: "networkidle2" });
    console.log("✅ Page reloaded with cookies applied");

    // Navigate to HNTS/Home Health button
    const homeHealth = await page.waitForSelector(
        '.au-target.btn.btn-axxess.btn-block.Home.Health.font-size-base',
        { visible: true, timeout: 10000 }
    );
    await homeHealth.click();
    console.log("✅ HNTS button clicked!");

    // Click Patient icon
    const patient = await page.waitForSelector('.d-none.d-xl-block.fas.fa-user', { visible: true, timeout: 10000 });
    await patient.click();
    console.log("✅ Patient icon clicked!");

    // Click Patient Charts
    const patientCharts = await page.waitForSelector(
        'ul.menu-list.right-list div.menu-item:has-text("Patient Charts")',
        { visible: true, timeout: 10000 }
    );
    await patientCharts.click();
    console.log("✅ Patient Charts clicked!");

    console.log("✅ Script finished. Browser is open with your Profile 6 and cookies.");
})();
