import crypto from './crypto.e2e'
import Tx from './Tx.e2e'

const testSuites = Object.entries({crypto, Tx})

export default async () => {
  console.log('[Tests START]')

  for (let i = 0; i < testSuites.length; i++) {
    const testSuite = testSuites[i]
    const testSuiteName = testSuite[0]
    const tests = Object.entries(testSuite[1])

    console.log(`[${testSuiteName}]`)
    for (let j = 0; j < tests.length; j++) {
      const testCase = tests[j]
      const testCaseName = testCase[0]
      const test = testCase[1]

      try {
        await test()
        console.log(`\t[Pass] ${testCaseName}`)
      } catch (e) {
        console.error(`\t[Fail] ${testCaseName}: ${e}`)
        // todo: test that this works in dev mode to
        // config.app.isProd && bugsnag.notify(`Blockchain test failure: ${res}: ${e}`)
      }
    }
  }

  console.log('[Tests END]')
}