import assert from './assert'
import Block, { getHashDifficulty } from './Block'
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

  'hash': async () => {
    const genesis = Block.getGenesis()
    const hash = await genesis.hashToHexStr()
    assert(hash.length === 64)
  },

  'create': async () => {
    const genesis = Block.getGenesis()
    const blockNo2 = await Block.create(await getSampleTxs(), genesis)
    assert(blockNo2 instanceof Block)

    await blockNo2.sign()
    await blockNo2.verify(genesis)

    blockNo2.sig = 'xxxxx' + blockNo2.sig.substring(5, blockNo2.sig.length)
    await assert.throws(() => blockNo2.verify(genesis), 'invalid block signature')
  },

  'toJson, fromJson': async () => {
    const genesis = Block.getGenesis()
    const newBlock = await Block.create(await getSampleTxs(), genesis)
    await newBlock.sign()

    const blockJson = newBlock.toJson()
    const parsedBlock = Block.getObjFromJson(blockJson)

    await parsedBlock.verify(genesis)
    assert(parsedBlock.time.getTime() === newBlock.time.getTime())
    assert(parsedBlock.txs[0].time.getTime() === newBlock.txs[0].time.getTime())
  },

  'sign, verifySign': async () => {
    // make sure that signing does not invalidate a block
    const genesis = Block.getGenesis()
    const signedBlock = await Block.create(await getSampleTxs(), genesis)
    await signedBlock.sign()
    await signedBlock.verifySig()

    // sign same block a second time and make sure that signatures turn out different (ec signing uses rng) but still valid
    const oldSig = signedBlock.sig
    await signedBlock.sign()
    await signedBlock.verifySig()
    assert.notEqual(oldSig, signedBlock.sig)
  },

  'getHashDifficulty': () => {
    // using Uint8Array
    const hash = new Uint8Array(3)
    hash[0] = 0
    hash[1] = 0
    hash[2] = 16
    const difficulty = getHashDifficulty(hash)
    assert(difficulty === 19)

    const hash2 = new Uint8Array(0)
    const difficulty2 = getHashDifficulty(hash2)
    assert(difficulty2 === 0)

    const hash3 = new Uint8Array(1)
    hash3[0] = 128
    const difficulty3 = getHashDifficulty(hash3)
    assert(difficulty3 === 0)

    // using Buffer
    // const hash4 = Buffer.alloc(2)
    // hash4[0] = 1
    // hash4[1] = 200
    // const difficulty4 = getHashDifficulty(hash4)
    // assert(difficulty4 === 7)
  },

  'verify': async () => {
    // verify the fields of assertion error
    try {
      assert(2 === 4, 'lorem')
    } catch (e) {
      assert(e.type === 'AssertionError')
      assert(e.message === 'lorem')
    }

    // verify assert.throws validation
    await assert.throws(async () => { throw new Error('wow') }, 'wow')

    // verify a valid signed and mined block
    const genesis = Block.getGenesis()
    const signedBlock = await Block.create(await getSampleTxs(), genesis)
    await signedBlock.sign()
    await signedBlock.verify(genesis)

    const minedBlock = await Block.create(await getSampleTxs(), genesis)
    minedBlock.minDifficulty = 1
    await minedBlock.mine()
    await minedBlock.verify(genesis)

    // // invalid sig
    // const noSigBlock = block.create(txs, genesisHeader)
    // assert.throws(() => block.verify(noSigBlock), e => e.message.includes('previous block'))
    // assert.throws(() => block.verify(noSigBlock, genesisHeader), e => e.message.includes('difficulty'))
    //
    // // invalid nonce
    // const invalidNonceBlock = block.create(txs, genesisHeader)
    // invalidNonceBlock.header.minDifficulty = 60
    // invalidNonceBlock.header.nonce = 100
    // assert.throws(() => block.verify(invalidNonceBlock, genesisHeader), e => e.message.includes('claimed difficulty'))
    //
    // // invalid prev hash
    // const invalidPrevHashBlock = block.create(txs, genesisHeader)
    // block.sign(invalidPrevHashBlock)
    // invalidPrevHashBlock.header.prevHash = 'Ypy9HtozxoOUejr7SLdqPbsJsBB39wqdzCcBOv3gaZ2O'
    // assert.throws(() => block.verify(invalidPrevHashBlock, genesisHeader), e => e.message.includes('previous block header hash'))
    //
    // // invalid tx count
    // const invalidTxCountBlock = block.create(txs, genesisHeader)
    // block.sign(invalidTxCountBlock)
    // invalidTxCountBlock.header.txCount = 5
    // assert.throws(() => block.verify(invalidTxCountBlock, genesisHeader), e => e.message.includes('count in header'))
    //
    // // invalid merkle root
    // const invalidMerkleRootBlock = block.create(txs, genesisHeader)
    // block.sign(invalidMerkleRootBlock)
    // invalidMerkleRootBlock.header.merkleRoot = '4aMCaTeNGYtd9Wgcz4j4X6SNzCtHYhUZQPG9pUG9Xz7T'
    // assert.throws(() => block.verify(invalidMerkleRootBlock, genesisHeader), e => e.message.includes('root is not valid'))
    //
    // // invalid time
    // const invalidTimeBlock = block.create(txs, genesisHeader)
    // block.sign(invalidTimeBlock)
    // invalidTimeBlock.header.time = new Date('01 Jan 2010 00:00:00 UTC')
    // assert.throws(() => block.verify(invalidTimeBlock, genesisHeader), e => e.message.includes('time is invalid'))
    //
    // // invalid tx
    // const invalidTxBlock = block.create(txs, genesisHeader)
    // block.sign(invalidTxBlock)
    // invalidTxBlock.txs[0].sig = '12234'
    // assert.throws(() => block.verify(invalidTxBlock, genesisHeader), e => e.message.includes('txs in given'))
  },

  'mineBlock': () => {
    // const genesisHeader = block.getGenesisBlock().header
    // const minedBlock = block.create(txs, genesisHeader)
    // minedBlock.header.minDifficulty = 8
    // const miningRes = block.mineBlock(minedBlock)
    //
    // assert(miningRes.hashBase64.substring(0, 1) === 'A')
    // assert(minedBlock.header.nonce > 0)
    //
    // block.verify(minedBlock, genesisHeader)
  },

  'mineBlock with empty txs': () => {
    // const genesisHeader = block.getGenesisBlock().header
    // const emptyTxs = []
    // const minedBlock = block.create(emptyTxs, genesisHeader)
    // minedBlock.header.minDifficulty = 4
    // block.mineBlock(minedBlock)
    //
    // block.verify(minedBlock, genesisHeader)
  }
}
