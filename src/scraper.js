const puppeteer = require('puppeteer');

async function scrapePage(url, takeScreenshot = false, screenshotPath = null, screenshotType = 'viewport') {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { waitUntil: 'networkidle2' });
  const html = await page.content();
  if (takeScreenshot && screenshotPath) {
    await page.screenshot({ path: screenshotPath, fullPage: screenshotType === 'full' });
  }
  await browser.close();
  return { html };
}

module.exports = { scrapePage };
