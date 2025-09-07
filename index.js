import puppeteer from "puppeteer";

const email = "pranavmanpuria@gmail.com";
const password = "MySecurePass123!";

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

try {
  console.log("🌐 Navigating to login page...");
  await page.goto("https://identity.axxessweb.com/login", {
    waitUntil: "networkidle2",
  });

  console.log("✉️ Typing email...");
  await page.type(
    'input[placeholder="Email Address or Domain"][autocomplete="username"]',
    email,
    { delay: 50 } // ⌛ delay per keystroke
  );

  console.log("➡️ Clicking Next...");
  await page.waitForSelector("button.btn.btn-axxess.btn-sm.mt-3:not([disabled])");
  await page.click("button.btn.btn-axxess.btn-sm.mt-3");

  console.log("🔑 Waiting for password field...");
  try {
    await page.waitForSelector(
      'input[type="password"][placeholder="Password"]',
      { visible: true, timeout: 10000 }
    );
  } catch {
    throw new Error(
      `Login failed: Password field not found. Email may be invalid. Used: ${email}`
    );
  }

  console.log("🔒 Typing password...");
  await page.type(
    'input[type="password"][placeholder="Password"]',
    password,
    { delay: 50 } // ⌛ delay per keystroke
  );

  console.log("🔓 Clicking Login...");
  await page.waitForSelector("button.btn.btn-axxess.btn-sm.mt-3:not([disabled])");
  await page.click("button.btn.btn-axxess.btn-sm.mt-3");

  console.log("📄 Waiting for agreement screen...");
  const testOk = await page.waitForSelector("#btn_ok", { timeout: 10000 });
  await testOk.click();

  console.log("📊 Waiting for dashboard...");
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  console.log("✅ Test ran successfully");
} catch (err) {
  console.error("❌ " + err.message);
} finally {
  console.log("🛑 Closing browser...");
  await browser.close();
}
