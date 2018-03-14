const assert = require('assert')
const block = require('./block')
const testData = require('../config/test').data
const AssertionError = require('assert').AssertionError

const txs = testData.txs

suite('block', () => {
  test('getGenesisBlock', () => {
    // verify genesis fields
    const genesis = block.getGenesisBlock()
    assert(genesis.sig === '')
    assert(genesis.header.no === 1)
    assert(genesis.header.prevHash === '')
    assert(genesis.header.txCount === 0)
    assert(genesis.header.merkleRoot === '')
    assert(genesis.header.time.getTime() === new Date('01 Jan 2018 00:00:00 UTC').getTime())
    assert(genesis.header.difficulty === 0)
    assert(genesis.header.nonce === 0)
    assert(Array.isArray(genesis.txs))
    assert(genesis.txs.length === 0)

    // verify immutability
    genesis.header.no = 10
    const genesis2 = block.getGenesisBlock()
    assert(genesis2.header.no === 1)
  })

  test('create', () => {
    const genesisHeader = block.getGenesisBlock().header
    const blockNo2 = block.create(txs, genesisHeader)
    assert.throws(() => block.verify(blockNo2, genesisHeader))

    block.sign(blockNo2)
    assert(block.verify(blockNo2, genesisHeader))
  })

  test('toJson, fromJson', () => {
    const genesisHeader = block.getGenesisBlock().header
    const newBlock = block.create(txs, genesisHeader)
    block.sign(newBlock)

    const blockJson = block.toJson(newBlock)
    const parsedBlock = block.fromJson(blockJson)

    assert(block.verify(parsedBlock, genesisHeader))
    assert(parsedBlock.header.time.getTime() === newBlock.header.time.getTime())
    assert(parsedBlock.txs[0].time.getTime() === newBlock.txs[0].time.getTime())
  })

  test('sign, verifySignature', () => {
    // make sure that signing does not invalidate a block
    const genesisHeader = block.getGenesisBlock().header
    const signedBlock = block.create(txs, genesisHeader)
    block.sign(signedBlock)
    block.verify(signedBlock, genesisHeader)

    // sign same thing twice and make sure that signatures turn out different (ec signing uses rng) but still valid
    const block1 = block.create(txs, genesisHeader)
    block.sign(block1)
    assert(block.verifySignature(block1))
    const block2 = block.create(txs, genesisHeader)
    block.sign(block2)
    assert(block.verifySignature(block2))
    assert(block1.sig !== block2.sig)
  })

  test('verify', () => {
    // verify the fields of assertion error
    try {
      assert(2 === 4, 'lorem')
    } catch (e) {
      assert(e instanceof AssertionError)
      assert(e.message === 'lorem')
    }

    // verify assert.throws validation
    assert.throws(() => { throw new Error('wow') }, e => e.message.includes('wow'))

    // verify a valid signed and mined block
    const genesisHeader = block.getGenesisBlock().header
    const signedBlock = block.create(txs, genesisHeader)
    block.sign(signedBlock)
    block.verify(signedBlock, genesisHeader)
    const minedBlock = block.create(txs, genesisHeader)
    minedBlock.header.difficulty = 1
    block.mineBlock(minedBlock)
    block.verify(minedBlock, genesisHeader)

    // invalid sig
    const noSigBlock = block.create(txs, genesisHeader)
    assert.throws(() => block.verify(noSigBlock), e => e.message.includes('previous block'))
    assert.throws(() => block.verify(noSigBlock, genesisHeader), e => e.message.includes('difficulty'))

    // invalid nonce
    const invalidNonceBlock = block.create(txs, genesisHeader)
    invalidNonceBlock.header.difficulty = 60
    invalidNonceBlock.header.nonce = 100
    assert.throws(() => block.verify(invalidNonceBlock, genesisHeader), e => e.message.includes('claimed difficulty'))

    // invalid prev hash
    const invalidPrevHashBlock = block.create(txs, genesisHeader)
    block.sign(invalidPrevHashBlock)
    invalidPrevHashBlock.header.prevHash = 'Ypy9HtozxoOUejr7SLdqPbsJsBB39wqdzCcBOv3gaZ2O'
    assert.throws(() => block.verify(invalidPrevHashBlock, genesisHeader), e => e.message.includes('previous block header hash'))

    // invalid tx count
    const invalidTxCountBlock = block.create(txs, genesisHeader)
    block.sign(invalidTxCountBlock)
    invalidTxCountBlock.header.txCount = 5
    assert.throws(() => block.verify(invalidTxCountBlock, genesisHeader), e => e.message.includes('count in header'))

    // invalid merkle root
    const invalidMerkleRootBlock = block.create(txs, genesisHeader)
    block.sign(invalidMerkleRootBlock)
    invalidMerkleRootBlock.header.merkleRoot = '4aMCaTeNGYtd9Wgcz4j4X6SNzCtHYhUZQPG9pUG9Xz7T'
    assert.throws(() => block.verify(invalidMerkleRootBlock, genesisHeader), e => e.message.includes('root is not valid'))

    // invalid time
    const invalidTimeBlock = block.create(txs, genesisHeader)
    block.sign(invalidTimeBlock)
    invalidTimeBlock.header.time = new Date('01 Jan 2010 00:00:00 UTC')
    assert.throws(() => block.verify(invalidTimeBlock, genesisHeader), e => e.message.includes('time is invalid'))

    // invalid tx
    const invalidTxBlock = block.create(txs, genesisHeader)
    block.sign(invalidTxBlock)
    invalidTxBlock.txs[0].sig = '12234'
    assert.throws(() => block.verify(invalidTxBlock, genesisHeader), e => e.message.includes('txs in given'))
  })

  test('getHashDifficulty', () => {
    // using Uint8Array
    const hash = new Uint8Array(3)
    hash[0] = 0
    hash[1] = 0
    hash[2] = 16
    const difficulty = block.getHashDifficulty(hash)
    assert(difficulty === 19)

    const hash2 = new Uint8Array(0)
    const difficulty2 = block.getHashDifficulty(hash2)
    assert(difficulty2 === 0)

    const hash3 = new Uint8Array(1)
    hash3[0] = 128
    const difficulty3 = block.getHashDifficulty(hash3)
    assert(difficulty3 === 0)

    // using Buffer
    const hash4 = Buffer.alloc(2)
    hash4[0] = 1
    hash4[1] = 200
    const difficulty4 = block.getHashDifficulty(hash4)
    assert(difficulty4 === 7)
  })

  test('mineBlock', () => {
    const genesisHeader = block.getGenesisBlock().header
    const minedBlock = block.create(txs, genesisHeader)
    minedBlock.header.difficulty = 8
    const hash = block.mineBlock(minedBlock)

    assert(hash.substring(0, 1) === 'A')
    assert(minedBlock.header.nonce > 0)

    block.verify(minedBlock, genesisHeader)
  })

  test('mineBlock with empty txs', () => {
    const genesisHeader = block.getGenesisBlock().header
    const emptyTxs = []
    const minedBlock = block.create(emptyTxs, genesisHeader)
    minedBlock.header.difficulty = 4
    block.mineBlock(minedBlock)

    block.verify(minedBlock, genesisHeader)
  })
})
