import assert from './assert.e2e'
import crypto from './crypto.e2e'
import Merkle from './Merkle.e2e'
import Tx from './Tx.e2e'
import Block from './Block.e2e'
import node from './node.e2e'
import config from '../data/config'
import bugsnag from '../data/bugsnag'

const testTimeout = 30 // seconds

const testSuites = Object.entries({assert, crypto, Merkle, Tx, Block, node})

export default async () => {
  console.log('[Tests START]')

  // todo: move initializers to a dedicated register method
  await config.initKeys()

  // run test marked as ONLY
  const allTests = testSuites.map(ts => Object.entries(ts[1]).map(tc => tc)).reduce((a, b) => [...a, ...b])
  const onlyTestCase = allTests.find(tc => tc[0].startsWith('O'))
  if (onlyTestCase) {
    console.log('Running single test case:', onlyTestCase[0].substring(1))
    await onlyTestCase[1]()
    console.log('Success')
    return
  }

  // run tests
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
        await Promise.race([
          test(),
          new Promise((resolve, reject) => setTimeout(() => reject(`test case did not complete in ${testTimeout} seconds`), testTimeout * 1000))])
        console.log(`\t[Pass] ${testCaseName}`)
      } catch (e) {
        console.error(`\t[Fail] ${testCaseName}: ${e}`)
        config.app.isProd && bugsnag.notify(`Test failure: ${testSuiteName}: ${testCaseName}: ${e}`)
      }
    }
  }

  console.log('[Tests END]')
}
