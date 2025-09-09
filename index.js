import puppeteer from "puppeteer";
import fs from "fs";

const USER_DATA_DIR = "./axxess_user_data"; // optional
const COOKIES_PATH = "./cookies.json";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: USER_DATA_DIR,
        args: [
            "--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure",
            "--disable-web-security",
            "--disable-site-isolation-trials",
        ],
    });

    const page = await browser.newPage();
    await page.goto("https://central.axxessweb.com/help", { waitUntil: "networkidle2" });

    // Load cookies
    const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, "utf-8"));
    await page.setCookie(...cookies);
    console.log("🍪 All cookies loaded from cookie.json");

    // Reload to apply cookies
    await page.reload({ waitUntil: "networkidle2" });
    console.log("✅ Logged in using cookies");

    // Navigate to dashboard

    const homeHealth = await page.waitForSelector(
        '.au-target.btn.btn-axxess.btn-block.Home.Health.font-size-base',
        { visible: true, timeout: 10000 }
    );
    await homeHealth.click();
    console.log("✅ HNTS button clicked!");

    const patient = await page.waitForSelector('.d-none.d-xl-block.fas.fa-user', { visible: true, timeout: 100000 });
    await patient.click();
    console.log("✅ Patient icon clicked!");
    const patientCharts = await page.waitForSelector('ul.menu-list.right-list div.menu-item:has-text("Patient Charts")', { visible: true, timeout: 10000 });
    await patientCharts.click();
    console.log("✅ Patient Charts clicked!");


})();
