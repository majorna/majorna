const assert = require('assert')
const block = require('./block')
const testData = require('../config/test').data

const txs = testData.txs

function getGenesisBlockClone () {
  const gen = JSON.parse(JSON.stringify(block.genesisBlock))
  gen.header.time = new Date(gen.header.time)
  return gen
}

// function verifyBlock (blockObj, prevBlock, txs) {
//   assert(blockObj.header.no === prevBlock.header.no + 1)
//   assert(blockObj.header.prevHash.length === 44)
//   assert(blockObj.header.txCount === txs.length)
//   if (txs.length) {
//     assert(blockObj.header.merkleRoot.length === 44)
//   } else {
//     assert(blockObj.header.merkleRoot === '')
//   }
//   assert(blockObj.header.time.getTime() <= (new Date()).getTime())
//   assert(blockObj.data.length === txs.length)
//
//   if (blockObj.sig) {
//     assert(blockObj.sig.length === 96)
//     assert(block.verifySignature(blockObj.header, blockObj.sig))
//     assert(blockObj.header.difficulty === 0)
//     assert(blockObj.header.nonce === 0)
//   } else {
//     assert(!blockObj.sig)
//     assert(blockObj.header.difficulty > 0)
//     assert(blockObj.header.nonce > 0)
//   }
// }

suite.only('block', () => {
  // test('createSignedBlock', () => {
  //   const blockObj = block.createSignedBlock(txs, getGenesisBlockClone())
  //   verifyBlock(blockObj, getGenesisBlockClone(), txs)
  //
  //   const minedBlockObj = block.createSignedBlock(txs, getGenesisBlockClone(), true)
  //   delete minedBlockObj.sig
  //   verifyBlock(minedBlockObj, getGenesisBlockClone(), txs)
  //
  //   // sign same thing twice and make sure that signatures turn out different (ec signing uses a random number)
  //   const sameSig1 = block.createSignedBlock(txs, getGenesisBlockClone())
  //   const sameSig2 = block.createSignedBlock(txs, getGenesisBlockClone())
  //   assert(sameSig1.sig !== sameSig2.sig)
  // })
  //
  // test('createSignedBlock with empy txs', () => {
  //   const emptyTxs = []
  //   const minedBlockObj = block.createSignedBlock(emptyTxs, getGenesisBlockClone(), true)
  //   delete minedBlockObj.sig
  //   verifyBlock(minedBlockObj, getGenesisBlockClone(), emptyTxs)
  // })

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
    const blockObj = block.createBlock(txs, getGenesisBlockClone())
    const hash = block.mineBlock(blockObj, targetDifficulty)
    assert(blockObj.header.difficulty >= targetDifficulty)
    assert(hash.substring(0, 1) === 'A')
    assert(blockObj.header.nonce > 0)
  })
})
