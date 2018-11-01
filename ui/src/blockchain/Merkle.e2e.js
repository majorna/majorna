import assert from '../utils/assert'
import Merkle from './Merkle'

export default {
  'root': async () => {
    const merkle = await Merkle.create([{name: '1'}, {name: '2'}, {name: '3'}])
    assert(merkle.root.length === 64)
  }
}
