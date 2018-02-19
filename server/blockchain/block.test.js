const assert = require('assert')
const block = require('./block')

const genBlock = block.genesisBlock
const txs = ['lorem', 'ipsum', 'dolor']

suite('block', () => {
  test('createMerkle', () => {
    const merkle = block.createMerkle(txs)
    assert(merkle.getMerkleRoot().toString('base64').length === 44)

    // nice representation of the merkle tree blocks in tree.levels as demonstrated in:
    // https://github.com/Tierion/merkle-tools#about-tree-generation-using-maketree
    // console.log(JSON.parse(JSON.stringify(merkle.getTree())))
  })

  test('createBlock', () => {
    const blockObj = block.createBlock(txs, genBlock)
    assert(blockObj.header.no === genBlock.header.no + 1)
    assert(blockObj.header.prevHash)
    assert(blockObj.header.txCount === txs.length)
    assert(blockObj.header.merkleRoot.length === 44)
    assert(blockObj.header.time.getTime() <= (new Date()).getTime())
    // assert(blockObj.header.difficulty > 0)
    // assert(blockObj.header.nonce > 0)

    // todo: verify merkle tree, root, and proof
    // todo: verify nonce, difficulty, and hash
  })
})
