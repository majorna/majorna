import assert from './assert'
import Merkle from './Merkle'

export default {
  'root': async () => {
    const merkle = new Merkle()
    await merkle.addLeaves([{name: '1'}, {name: '2'}, {name: '3'}])
    assert(merkle.getMerkleRoot().length === 64)
  }
}
