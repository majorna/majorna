const assert = require('assert')
const block = require('./block')

suite('block', () => {
  test('createMerkle', () => {
    const arr = ['lorem', 'ipsum', 'dolor']
    const merkle = block.createMerkle(arr)
    assert(merkle.getMerkleRoot().toString('base64').length === 44)

    // nice representation of the merkle tree in tree.levels as demonstrated in: https://github.com/Tierion/merkle-tools#about-tree-generation-using-maketree
    // console.log(JSON.parse(JSON.stringify(merkle.getTree())))
  })

  test('createBlock', () => {
    assert(true)
  })
})
