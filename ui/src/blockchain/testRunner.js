import Tx from './Tx.e2e'
import config from '../data/config'
import bugsnag from '../data/bugsnag'

const tests = {Tx}

export default () => {
  console.log('[Tests]')
  Object.entries(tests).forEach(t => {
    console.log(`[${t[0]}]`)
    Object.entries(t[1]).forEach(async c => {
      let res = `${c[0]}`
      try {
        await (c[1]())
        console.log(`\t[Pass] ${res}`)
      } catch (e) {
        console.error(`\t[Fail] ${res}: ${e}`)
        // todo: test that this works in dev mode to
        config.app.isProd && bugsnag.notify(`Blockchain test failure: ${res}: ${e}`)
      }
    })
  })
}