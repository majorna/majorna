const puppeteer = require('puppeteer');

(async () => {
  // https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-travis-ci
  const browser = await puppeteer.launch(/*{headless: false}*/)
  const page = await browser.newPage()
  await page.goto('http://localhost:3002')

  // todo: need to login to initiate tests

  // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('console', async msg => msg.text() === '[Test END]' || msg.text() === '[Test FAIL]' && await browser.close())
})()