import assert from './assert'
import Tx from './Tx'

const getSampleTx = () => new Tx(null, 'tx-123', '1', 500, '2', 500, new Date(), 25)

export default {
  verify: async () => {
    const tx = getSampleTx()
    try {
      await tx.verify()
    } catch (e) {
      assert.equal(e.type, 'AssertionError')
    }
    await tx.sign()
    await tx.verify()
  },

  'json stringify': async () => {
    const tx = getSampleTx()
    await tx.sign()
    const jsonStr = JSON.stringify(tx)
    const txObj = Tx.getObjFromJson(jsonStr)
    await txObj.verify()
  }
}
