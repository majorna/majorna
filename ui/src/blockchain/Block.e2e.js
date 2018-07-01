import assert from './assert'
import Block from './Block'

const getSampleBlock = () => new Block('', 2, 0, '', new Date(), 0, 0, [])

export default {
  'ctor': async () => {
    // unsigned tx
    const block = getSampleBlock()
    assert(block)
  },

  'genesis': () => {
    assert(Block.getGenesis().no === 1)
  }
}
