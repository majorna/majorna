const assert = require('assert')
const testConfig = require('../config/test')
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
    const blockPath = testConfig.getGitHubTestFilePath()
    await blockchain.insertBlockSinceLastOne(new Date(), blockInfo, blockPath)

    const blockFile = await github.getFileContent(blockPath)
    const blockObj = block.fromJson(blockFile)

    assert(blockObj.header.no === blockInfo.header.no)

    // now repeat again and verify the last inserted block with the previous one
    const blockInfo2 = await db.getBlockInfo()
    const blockPath2 = testConfig.getGitHubTestFilePath()
    await blockchain.insertBlockSinceLastOne(new Date(), blockInfo2, blockPath2)

    const blockFile2 = await github.getFileContent(blockPath2)
    const blockObj2 = block.fromJson(blockFile2)

    block.verify(blockObj2, blockObj.header)
    assert(blockObj2.header.no === (blockInfo.header.no + 1))

    // and once more
    let blockInfo3 = await db.getBlockInfo()
    const miningRes = block.mineHeaderStr(blockInfo3.miner.headerStrWithoutNonce, blockInfo3.miner.targetDifficulty)
    await db.giveMiningReward('1', miningRes.nonce)
    blockInfo3 = await db.getBlockInfo()
    const blockPath3 = testConfig.getGitHubTestFilePath()
    await blockchain.insertBlockSinceLastOne(new Date(), blockInfo3, blockPath3)

    const blockFile3 = await github.getFileContent(blockPath3)
    const blockObj3 = block.fromJson(blockFile3)

    block.verify(blockObj3, blockObj2.header)
    assert(blockObj3.header.no === (blockInfo.header.no + 2))
  })

  test('insertBlockIfRequired', async () => {
    const mineableBlockInfo = await db.getBlockInfo()
    const miningRes = block.mineHeaderStr(mineableBlockInfo.miner.headerStrWithoutNonce, mineableBlockInfo.miner.targetDifficulty)
    await db.giveMiningReward('1', miningRes.nonce)

    await db.makeTx('1', '2', 1)
    const tomorrow = new Date() // end search in tomorrow so we can pick up test tx from the database (5 min latency for ongoing txs stuff...)
    tomorrow.setDate(tomorrow.getDate() + 2)
    const blockPath = testConfig.getGitHubTestFilePath()

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
    const blockPath2 = testConfig.getGitHubTestFilePath()
    await blockchain.insertBlockIfRequired(tomorrow, blockPath2)
    await assert.rejects(() => github.getFileContent(blockPath2))
  })

  test('startBlockchainInsertTimer', () => {
    const timer = blockchain.startBlockchainInsertTimer(30)
    clearInterval(timer)
  })
})
