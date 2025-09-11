await page.waitForSelector('ul#app-expanded-menu li.menu span', {
  visible: true,
  timeout: 60000,
});

// 1️⃣ Find Patients menu
const patientsMenu = await page.evaluateHandle(() => {
  const items = document.querySelectorAll('ul#app-expanded-menu li.menu span');
  return Array.from(items).find(el =>
    el.innerText.trim().includes("Patients")
  );
});

if (patientsMenu) {
  // log its HTML
  const patientsHtml = await page.evaluate(el => el.outerHTML, patientsMenu);
  console.log("🔍 Patients menu HTML:", patientsHtml);

  // click it
  await patientsMenu.click();
  console.log("✅ Patients menu clicked (desktop)");

  // 2️⃣ Wait for dropdown to appear
  await page.waitForSelector('ul.menu-list.right-list div.menu-item', {
    visible: true,
    timeout: 60000,
  });

  // 3️⃣ Find Patient Charts option
  const patientCharts = await page.evaluateHandle(() => {
    const items = document.querySelectorAll('ul.menu-list.right-list div.menu-item');
    return Array.from(items).find(el =>
      el.innerText.trim().includes("Patient Charts")
    );
  });

  if (patientCharts) {
    // log its HTML
    const chartsHtml = await page.evaluate(el => el.outerHTML, patientCharts);
    console.log("🔍 Patient Charts menu HTML:", chartsHtml);

    // click it
    await patientCharts.click();
    console.log("✅ Patient Charts clicked!");
  } else {
    console.log("❌ Patient Charts option not found");
  }
} else {
  console.log("❌ Patients menu not found");
}

const searchInput = await page.waitForSelector('input[placeholder="Search Patients"]', {
  visible: true,
  timeout: 60000,
});

// Log input HTML
const inputHtml = await page.evaluate(el => el.outerHTML, searchInput);
console.log("🔍 Search Input HTML:", inputHtml);

// 2️⃣ Clear the input before typing
await searchInput.click({ clickCount: 3 }); // select all text
await page.keyboard.press("Backspace");     // delete it
// (Extra safety: force-clear value)
await page.evaluate(el => el.value = "", searchInput);
console.log("🧹 Cleared search input");

// 3️⃣ Type into input
await searchInput.type("AGUILAR, MARY E", { delay: 100 });
console.log("✅ Typed into search input");
