const assert = require('assert')
const blockchain = require('./blockchain')
const github = require('../data/github')
const db = require('../data/db')
const block = require('./block')

suite('blockchain', () => {
  // test('getBlockPath', () => {
  //   const now = new Date('2018-02-15T10:00:00.000Z')
  //   const path = blockchain.getBlockPath(now)
  //   assert(path === '2018/2/15')
  //
  //   const path2 = blockchain.getBlockPath(now, -1)
  //   assert(path2 === '2018/2/14')
  //
  //   const path3 = blockchain.getBlockPath(now, -30)
  //   assert(path3 === '2018/1/16')
  //
  //   const path4 = blockchain.getBlockPath(now, 30)
  //   assert(path4 === '2018/3/17')
  // })

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
    await db.makeTx('1', '2', 1)
    const tomorrow = new Date() // end search in tomorrow so we can pick up test tx from the database (5 min latency for ongoing txs stuff...)
    tomorrow.setDate(tomorrow.getDate() + 2)
    const blockPath = new Date().getTime()

    await blockchain.insertBlockIfRequired(tomorrow, blockPath)

    // git repo has previous block file
    const blockFile = await github.getFileContent(blockPath)
    assert(blockFile.includes('"header":'))
    const blockObj = block.fromJson(blockFile)

    // verify newly created block from database with the header form the old one in git repo
    const blockInfo = await db.getBlockInfo()
    const newBlock = await db.getBlock(blockInfo.header.no)
    block.verify(newBlock, blockObj.header)

    // not required
    const blockPath2 = new Date().getTime()
    await blockchain.insertBlockIfRequired(tomorrow, blockPath2)
    let err
    try {
      await github.getFileContent(blockPath2)
    } catch (e) { err = e }
    assert(err)
  })

  test('startBlockchainInsertTimer', () => {
    const timer = blockchain.startBlockchainInsertTimer(30)
    clearInterval(timer)
  })
})
