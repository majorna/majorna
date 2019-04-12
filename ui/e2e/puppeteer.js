/**
 * API Docs: https://pptr.dev/
 * CI Tips: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-travis-ci
 */
const puppeteer = require('puppeteer')

const debugTestEnv = true
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

;(async () => {
  const browser = await puppeteer.launch(debugTestEnv ? {headless: false} : undefined)
  const page = await browser.newPage()
  debugTestEnv && page.on('console', msg => console.log('UI console.log:', msg.text()))

  // wait until ui server starts
  for (let i = 0; i < 10; i++) {
    try {
      await page.goto('http://localhost:3002')
      break
    } catch {
      console.log(`Waiting for home page to appear: ${i}`)
      await sleep(1000)
    }
  }

  // todo: need to login to initiate tests

  page.on('console', async msg => msg.text() === '[Test END]' || msg.text() === '[Test FAIL]' && await browser.close())

  console.log('E2E tests done!')
})()