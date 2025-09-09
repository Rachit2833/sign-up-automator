import puppeteer from "puppeteer";
import fs from "fs";

// Path to your installed Chrome
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// Use your Chrome Profile 6
const USER_DATA_DIR = "/Users/rachit2833/Library/Application Support/Google/Chrome/Profile 5";

// Optional: cookies file if you want to set them manually
const COOKIES_PATH = "./cookies.json";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        userDataDir: "/Users/rachit2833/Library/Application Support/Google/Chrome", // parent folder
        args: [
            '--profile-directory=Profile 6', // specify which profile to use
            "--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure",
            "--disable-web-security",
            "--disable-site-isolation-trials",
        ],
    });


    const page = await browser.newPage();
    await page.goto("https://central.axxessweb.com/help", { waitUntil: "networkidle2" });

    // Optional: load cookies (Profile 6 already has your logins, so usually not needed)
    if (fs.existsSync(COOKIES_PATH)) {
        const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, "utf-8"));
        await page.setCookie(...cookies);
        console.log("🍪 Cookies loaded from file");
        await page.reload({ waitUntil: "networkidle2" });
    }

    console.log("✅ Using Chrome Profile 6. You are logged in!");
})();
