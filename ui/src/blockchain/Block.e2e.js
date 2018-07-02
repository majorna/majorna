import assert from './assert'
import Block from './Block'
import Tx from './Tx'

const getSampleBlock = () => new Block('', 2, 0, '', new Date(), 0, 0, [])

const getSampleTxs = async () => {
  const tx1 = new Tx(null, 'tx-123', '1', 500, '2', 500, new Date(), 25)
  await tx1.sign()
  const tx2 = new Tx(null, 'tx-456', '2', 525, '1', 475, new Date(), 10)
  await tx2.sign()
  return [tx1, tx2]
}

export default {
  'constructor': async () => {
    const block = getSampleBlock()
    assert(block)
  },

  'getGenesis': () => {
    // verify genesis fields
    const genesis = Block.getGenesis()
    assert(genesis instanceof Block)
    assert(genesis.sig === '')
    assert(genesis.no === 1)
    assert(genesis.prevHash === '')
    assert(genesis.txCount === 0)
    assert(genesis.merkleRoot === '')
    assert(genesis.time.getTime() === new Date('01 Jan 2018 00:00:00 UTC').getTime())
    assert(genesis.minDifficulty === 0)
    assert(genesis.nonce === 0)
    assert(Array.isArray(genesis.txs))
    assert(genesis.txs.length === 0)

    // verify immutability
    genesis.no = 10
    const genesis2 = Block.getGenesis()
    assert(genesis2.no === 1)
  },

  'create': async () => {
    const genesis = Block.getGenesis()
    const blockNo2 = await Block.create(await getSampleTxs(), genesis)
    assert(blockNo2 instanceof Block)
    await assert.throws(() => blockNo2.verify(genesis))

    // await blockNo2.sign()
    // blockNo2.verify(genesis)
  }
}
