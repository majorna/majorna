import crypto from './crypto.e2e'
import Merkle from './Merkle.e2e'
import Tx from './Tx.e2e'
import Block from './Block.e2e'
import config from '../data/config'
import bugsnag from '../data/bugsnag'

const testSuites = Object.entries({crypto, Merkle, Tx, Block})

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
        config.app.isProd && bugsnag.notify(`Test failure: ${testSuiteName}: ${testCaseName}: ${e}`)
      }
    }
  }

  console.log('[Tests END]')
}
