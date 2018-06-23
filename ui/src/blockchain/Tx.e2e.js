import assert from './assert'
import Tx from './Tx'

const getSampleTx = () => new Tx(null, 'tx-123', '1', 500, '2', 500, new Date(), 25)

export default {
  verify: async () => {
    const tx = getSampleTx()
    await tx.sign()
    await tx.verify()
  },

  'json stringify': () => {
    const tx = getSampleTx()
    const jsonStr = JSON.stringify(tx)
    const parsedTx = JSON.parse(jsonStr)
    assert(!parsedTx.schema)
  }
}

// todo: verify getObj() complies with the schema
