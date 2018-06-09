import Tx from './Tx.e2e'

const tests = {Tx}

export default () => {
  Object.entries(tests).forEach(t => {
    Object.entries(t[1]).forEach(async c => {
      console.log(`${t[0]}: ${c[0]}`)
      await (c[1]())
    })
  })
}