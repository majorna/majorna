import assert from './assert'
import Tx from './Tx'

const getSampleTx = () => new Tx(null, 'tx-123', '1', 500, '2', 500, new Date(), 25)

export default {
  'verify': async () => {
    // unsigned tx
    const tx = getSampleTx()
    try {
      await tx.verify()
    } catch (e) {
      assert.equal(e.type, 'AssertionError')
    }

    // signed tx
    await tx.sign()
    await tx.verify()
  },

  'json stringify': async () => {
    const tx = getSampleTx()
    await tx.sign()
    const jsonStr = tx.toJson()
    assert(jsonStr.split('\n')[0] === '{', 'tx json should be indented')
    const txObj = Tx.getObjFromJson(jsonStr)
    await txObj.verify()
  }
}
