const assert = require('assert')
const blockchain = require('./blockchain')
const github = require('../data/github')
const db = require('../data/db')
// const block = require('./block')
// const testData = require('../config/test').data

suite('blockchain', () => {
  test.only('insertBlockSinceLastOne', async () => {
    const blockInfo = await db.getBlockInfo()
    await blockchain.insertBlockSinceLastOne(new Date(), blockInfo, `-${new Date().getTime()}`)

    // create a block of all txs since genesis
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1) // end search in tomorrow so we can pick up test txs from the database

    const blockInfo2 = await db.getBlockInfo()
    await blockchain.insertBlockSinceLastOne(tomorrow, blockInfo2, `-${new Date().getTime()}`)

    // const blockFile = await github.getFileContent(path)
    // const blockObj = block.fromJson(blockFile)
    //
    // assert(blockObj.sig.length === 96)
    // assert(blockObj.header.no === 2)
    // assert(blockObj.txs.length >= testData.txs.length)
    //
    // // create the consecutive block with same txs in it
    // // same txs will be picked up since blocks include txs up to last block creation day's midnight
    // // (which will still include today in this test case)
    // const path2 = blockchain.getBlockPath(tomorrow) + '-' + new Date().getTime()
    // await blockchain.insertBlockSinceLastOne(tomorrow, path2)
    //
    // const blockFile2 = await github.getFileContent(path2)
    // const blockObj2 = block.fromJson(blockFile2)
    //
    // assert(blockObj2.sig.length === 96)
    // assert(blockObj2.header.no === 3)
    // assert(blockObj2.txs.length === blockObj.txs.length)
  })

  test('insertBlockIfRequired', async () => {
    const tomorrow = new Date() // end search in tomorrow so we can pick up test txs from the database
    tomorrow.setDate(tomorrow.getDate() + 1)
    const path = blockchain.getBlockPath(new Date()) + '-' + new Date().getTime()
    const inserted = await blockchain.insertBlockIfRequired(path, tomorrow)
    assert(inserted)
    const blockFile = await github.getFileContent(path)
    assert(blockFile.includes('"txs":'))

    // not required
    const inserted2 = await blockchain.insertBlockIfRequired(path, tomorrow)
    assert(!inserted2)
  })
})
