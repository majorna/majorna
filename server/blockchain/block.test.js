const assert = require('assert')
const block = require('./block')
const testData = require('../config/test').data

const genBlock = block.genesisBlock
const txs = testData.txs

suite('block', () => {
  test('createMerkle', () => {
    const merkle = block.createMerkle(txs)
    assert(merkle.getMerkleRoot().toString('base64').length === 44)

    // nice representation of the merkle tree blocks in tree.levels as demonstrated in:
    // https://github.com/Tierion/merkle-tools#about-tree-generation-using-maketree
    // console.log(JSON.parse(JSON.stringify(merkle.getTree())))
  })

  function verifyBlock (blockObj, prevBlock, txs) {
    assert(blockObj.header.no === prevBlock.header.no + 1)
    assert(blockObj.header.prevHash.length === 44)
    assert(blockObj.header.txCount === txs.length)
    if (txs.length) {
      assert(blockObj.header.merkleRoot.length === 44)
    } else {
      assert(blockObj.header.merkleRoot === '')
    }
    assert(blockObj.header.time.getTime() <= (new Date()).getTime())
    assert(blockObj.data.length === txs.length)

    if (blockObj.sig) {
      assert(blockObj.sig.length === 96)
      assert(block.verifySignature(blockObj.header, blockObj.sig))
      assert(blockObj.header.difficulty === 0)
      assert(blockObj.header.nonce === 0)
    } else {
      assert(blockObj.header.difficulty > 0)
      assert(blockObj.header.nonce > 0)
    }
  }

  test('createSignedBlock', () => {
    const blockObj = block.createSignedBlock(txs, genBlock)
    verifyBlock(blockObj, genBlock, txs)

    const minedBlockObj = block.createSignedBlock(txs, genBlock, true)
    delete minedBlockObj.sig
    verifyBlock(minedBlockObj, genBlock, txs)

    // sign same thing twice and make sure that signatures turn out different (ec signing uses a random number)
    const sameSig1 = block.createSignedBlock(txs, genBlock)
    const sameSig2 = block.createSignedBlock(txs, genBlock)
    assert(sameSig1.sig !== sameSig2.sig)
  })

  test('createSignedBlock with empy txs', () => {
    const emptyTxs = []
    const minedBlockObj = block.createSignedBlock(emptyTxs, genBlock, true)
    delete minedBlockObj.sig
    verifyBlock(minedBlockObj, genBlock, emptyTxs)
  })

  test('verifyBlock', () => {})

  test('getTxProof', () => {})

  test('verifyTxInBlock', () => {})

  test('mineBlock', () => {
    const blockObj = block.createSignedBlock(txs, genBlock)
    block.mineBlock(blockObj)
    assert(blockObj.header.difficulty > 0)
    assert(blockObj.header.nonce > 0)
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
})
