import assert from './assert'
import Merkle from './Merkle'

export default {
  'make and verify': async () => {
    const merkle = new Merkle()
    assert(merkle)
  }
}
