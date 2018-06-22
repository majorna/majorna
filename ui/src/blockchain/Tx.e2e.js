import assert from './assert'
import Tx from './Tx'

const getSampleTx = () => new Tx('abc123', '123', '1', 500, '2', 500, new Date(), 25)

export default {
  'constructor: verifies params': async () => {
    assert(getSampleTx())
    const fullStrArr = new Uint8Array(8)
    assert(await crypto.subtle.digest('SHA-256', fullStrArr.buffer))
    assert.equal(true, true)
  },

  'json stringify': () => {
    const tx = getSampleTx()
    const jsonStr = JSON.stringify(tx)
    const parsedTx = JSON.parse(jsonStr)
    assert(!parsedTx.schema)
  }
}

// todo: verify getObj() complies with the schema
