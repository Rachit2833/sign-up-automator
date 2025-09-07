import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();
const email =  "abc123@gmail.com"
const password ="MySecurePass123!"
await page.goto("https://identity.axxessweb.com/login", {
  waitUntil: "networkidle2",
});


await page.type(
  'input[placeholder="Email Address or Domain"][autocomplete="username"]',
  email,
  { delay: 50 }
);


await page.waitForSelector("button.btn.btn-axxess.btn-sm.mt-3:not([disabled])");
await page.click("button.btn.btn-axxess.btn-sm.mt-3");


await page.waitForSelector('input[type="password"][placeholder="Password"]', {
  visible: true,
});


await page.type(
  'input[type="password"][placeholder="Password"]',
   password,
  { delay: 50 }
);


await page.waitForSelector("button.btn.btn-axxess.btn-sm.mt-3:not([disabled])");
await page.click("button.btn.btn-axxess.btn-sm.mt-3");
// await page.waitForNavigation({ waitUntil: "networkidle2"}); // remove if the succesfull login doesn't cause reload ,navigation or even if the code stops before this throwing errors like timeout
const testOk =await page.waitForSelector('#btn_ok')
await testOk.click()
await page.waitForNavigation({ waitUntil: "networkidle2"}); 
await new Promise(resolve=>setTimeout(resolve,5000))
console.log("test ran succesfully");
// Close browser
await browser.close();
