import assert from './assert'
import Merkle from './Merkle'

export default {
  'root': async () => {
    const merkle = await Merkle.create([{name: '1'}, {name: '2'}, {name: '3'}])
    assert(merkle.getMerkleRoot().length === 64)
  }
}
