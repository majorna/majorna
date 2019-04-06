const puppeteer = require('puppeteer')

(async () => {
  // https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-travis-ci
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:3002')

  // todo: check logs for [Test END] -or- [Test FAIL]: page.on('console', msg => ...)

  await browser.close()
})()