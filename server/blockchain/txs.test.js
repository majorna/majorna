const assert = require('assert')
const txs = require('./txs')
const testData = require('../config/test').data

suite('txs', () => {
  test('createMerkle', () => {
    const merkle = txs.createMerkle(testData.txs)
    assert(merkle.getMerkleRoot().toString('hex').length === 64)

    // nice representation of the merkle tree blocks in tree.levels as demonstrated in:
    // https://github.com/Tierion/merkle-tools#about-tree-generation-using-maketree
    // console.log(JSON.parse(JSON.stringify(merkle.getTree())))
  })
})
