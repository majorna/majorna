const assert = require('assert')
const blockchain = require('./blockchain')
const github = require('../data/github')
const db = require('../data/db')
const block = require('./block')

suite('blockchain', () => {
  test('insertBlockSinceLastOne', async () => {
    // create a new block and write the previous one to git repo
    const blockInfo = await db.getBlockInfo()
    const blockPath = new Date().getTime()
    await blockchain.insertBlockSinceLastOne(new Date(), blockInfo, blockPath)

    const blockFile = await github.getFileContent(blockPath)
    const blockObj = block.fromJson(blockFile)

    // now repeat again and verify the last inserted block with the previous one
    const blockInfo2 = await db.getBlockInfo()
    const blockPath2 = new Date().getTime()
    await blockchain.insertBlockSinceLastOne(new Date(), blockInfo2, blockPath2)

    const blockFile2 = await github.getFileContent(blockPath2)
    const blockObj2 = block.fromJson(blockFile2)

    block.verify(blockObj2, blockObj.header)
  })

  test('insertBlockIfRequired', async () => {
    const tomorrow = new Date() // end search in tomorrow so we can pick up test txs from the database
    tomorrow.setDate(tomorrow.getDate() + 2)
    const blockPath = new Date().getTime()

    const inserted = await blockchain.insertBlockIfRequired(tomorrow, blockPath)
    assert(inserted)

    // git repo has previous block file
    const blockFile = await github.getFileContent(blockPath)
    assert(blockFile.includes('"header":'))
    const blockObj = block.fromJson(blockFile)

    // verify newly created block from database with the header form the old one in git repo
    const blockInfo = await db.getBlockInfo()
    const newBlock = await db.getBlock(blockInfo.header.no)
    block.verify(newBlock, blockObj.header)

    // not required
    const inserted2 = await blockchain.insertBlockIfRequired(tomorrow, new Date().getTime())
    assert(!inserted2)
  })
})
