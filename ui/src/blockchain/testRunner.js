import Tx from './Tx.e2e'

const tests = {Tx}

export default () => {
  console.log('[Tests START]')
  Object.entries(tests).forEach(t => {
    Object.entries(t[1]).forEach(async c => {
      console.log(`\t${t[0]}: ${c[0]}`)
      await (c[1]())
    })
  })
  console.log('[Tests END]')
}