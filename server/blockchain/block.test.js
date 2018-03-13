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

  test('createBlock', () => {
    const genesisHeader = block.getGenesisBlock().header
    const blockNo2 = block.createBlock(txs, genesisHeader)
    assert.throws(() => block.verify(blockNo2, genesisHeader))

    block.sign(blockNo2)
    assert(block.verify(blockNo2, genesisHeader))
  })

  test('toJson, fromJson', () => {
    const newBlock = block.createBlock(txs, block.getGenesisBlock().header)
    const blockJson = block.toJson(newBlock)
    const parsedBlock = block.fromJson(blockJson)
    assert(parsedBlock.header.time.getTime() === newBlock.header.time.getTime())
    assert(parsedBlock.txs[0].time.getTime() === newBlock.txs[0].time.getTime())
  })

  test('sign', () => {
    const signedBlock = block.createBlock(txs, block.getGenesisBlock().header)
    block.sign(signedBlock)
    block.verify(signedBlock, block.getGenesisBlock().header)

    // sign same thing twice and make sure that signatures turn out different (ec signing uses a random number)
    const block1 = block.createBlock(txs, block.getGenesisBlock().header)
    block.sign(block1)
    const block2 = block.createBlock(txs, block.getGenesisBlock().header)
    block.sign(block2)
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

    // verify a valid signed and mined block

    // invalid blocks
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
    const targetDifficulty = 8
    const minedBlock = block.createBlock(txs, block.getGenesisBlock().header)
    const hash = block.mineBlock(minedBlock, targetDifficulty)
    block.verify(minedBlock, block.getGenesisBlock().header)

    assert(minedBlock.header.difficulty >= targetDifficulty)
    assert(hash.substring(0, 1) === 'A')
    assert(minedBlock.header.nonce > 0)
  })

  test('mineBlock with empty txs', () => {
    const emptyTxs = []
    const minedBlock = block.createBlock(emptyTxs, block.getGenesisBlock().header)
    block.mineBlock(minedBlock, 4)
    block.verify(minedBlock, block.getGenesisBlock().header)
  })
})
