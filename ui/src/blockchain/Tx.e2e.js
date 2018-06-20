import assert from './assert'
import Tx from './Tx'

const getSampleTx = () => new Tx('abc123', '123', '1', 500, '2', 500, new Date(), 20)

export default {
  constructor: async () => {
    assert(getSampleTx())
    const fullStrArr = new Uint8Array(8)
    assert(await crypto.subtle.digest('SHA-256', fullStrArr.buffer))
  },

  jsonStringify: () => {
    const tx = getSampleTx()
    const json = JSON.stringify(tx)
    assert(json)
  }
}

// todo: verify getObj() complies with the schema
