import assert from './assert'
import Tx from './Tx'

export default {
  ctor: async () => {
    assert(new Tx())
    const fullStrArr = new Uint8Array(8)
    assert(await crypto.subtle.digest('SHA-256', fullStrArr.buffer))
  }
}

// todo: verify getObj() complies with the schema
