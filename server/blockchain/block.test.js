const assert = require('assert')
const block = require('./block')
const crypto = require('./crypto')

const genBlock = block.genesisBlock
const txs = ['lorem', 'ipsum', 'dolor']

function verifyBlock (blockObj, prevBlock, txs) {
  assert(blockObj.header.no === prevBlock.header.no + 1)
  assert(blockObj.header.prevHash.length === 44)
  assert(blockObj.header.txCount === txs.length)
  txs.length && assert(blockObj.header.merkleRoot.length === 44)
  assert(blockObj.header.time.getTime() <= (new Date()).getTime())

  if (blockObj.sig) {
    assert(blockObj.sig.length === 96)
    assert(crypto.verifyObj(blockObj.header, blockObj.sig))
    assert(blockObj.header.difficulty === 0)
    assert(blockObj.header.nonce === 0)
  } else {
    assert(blockObj.header.difficulty > 0)
    assert(blockObj.header.nonce > 0)
  }
}

suite('block', () => {
  test('createMerkle', () => {
    const merkle = block.createMerkle(txs)
    assert(merkle.getMerkleRoot().toString('base64').length === 44)

    // nice representation of the merkle tree blocks in tree.levels as demonstrated in:
    // https://github.com/Tierion/merkle-tools#about-tree-generation-using-maketree
    // console.log(JSON.parse(JSON.stringify(merkle.getTree())))
  })

  test('createSignedBlock', () => {
    const blockObj = block.createSignedBlock(txs, genBlock)
    verifyBlock(blockObj, genBlock, txs)

    const minedBlockObj = block.createSignedBlock(txs, genBlock, true)
    delete minedBlockObj.sig
    verifyBlock(minedBlockObj, genBlock, txs)
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
    const minedBlock = block.mineBlock(blockObj)
    assert(minedBlock.header.difficulty > 0)
    assert(minedBlock.header.nonce > 0)
  })
})
