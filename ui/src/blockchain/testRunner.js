import Tx from './Tx.e2e'

const tests = {Tx}

export default () => {
  console.log('[Tests]')
  Object.entries(tests).forEach(t => {
    Object.entries(t[1]).forEach(async c => {
      let res = `\t${t[0]}: ${c[0]}`
      try {
        await (c[1]())
        console.log(`${res}: pass`)
      } catch (e) {
        console.error(`${res}: fail: ${e}`)
      }
    })
  })
}