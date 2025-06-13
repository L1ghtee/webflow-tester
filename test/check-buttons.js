const { chromium } = require('playwright');

const urlsToTest = [
  'https://genesis-mamopay.webflow.io/',
  
  // ➕ Додай ще URL за потреби
];

async function runTest() {
  const browser = await chromium.launch();

  for (const url of urlsToTest) {
    const page = await browser.newPage();
    console.log(`\n🌐 Testing page: ${url}`);
    await page.goto(url);

    const buttons = await page.$$(`button, [role="button"], a[role="button"]`);
    console.log(`🔘 Found ${buttons.length} buttons`);

    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      const text = (await btn.textContent())?.trim() || '<no text>';
      const id = await btn.getAttribute('id');
      const href = await btn.getAttribute('href');

      console.log(`\n🔍 Button ${i + 1}:`);
      console.log(`   📛 Text: "${text}"`);
      if (id) console.log(`   🏷️ ID: ${id}`);
      if (href) console.log(`   🔗 Href: ${href}`);

      const visible = await btn.isVisible();
      if (!visible) {
        console.error(`   ❌ NOT visible`);
        continue;
      }

      const isDisabled = await btn.evaluate(
        node => node.hasAttribute('disabled') || node.getAttribute('aria-disabled') === 'true'
      );
      if (isDisabled) {
        console.error(`   ❌ Disabled`);
        continue;
      }

      try {
        await btn.click({ timeout: 3000 });
        console.log(`   ✅ Clickable`);
      } catch (err) {
        console.error(`   ❌ NOT clickable: ${err.message}`);
      }
    }

    await page.close();
  }

  await browser.close();
}

module.exports = runTest;
