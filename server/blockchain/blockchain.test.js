const assert = require('assert')
const blockchain = require('./blockchain')
const github = require('../data/github')
const block = require('./block')
const utils = require('../data/utils')
const testData = require('../config/test').data

suite('blockchain', () => {
  test('getBlockTimeRange', () => {
    const start = new Date('2018-02-15T10:00:00.000Z')
    const end = new Date('2018-02-20T11:00:00.000Z')
    const range = blockchain.getBlockTimeRange(start, end)

    assert(range.start.getTime() === (range.end.getTime() - 1000 * 60 * 60 * 24 * 5))
    assert(range.start.getTime() === (start.getTime() - 1000 * 60 * 60 * 10))
    assert(range.end.getTime() === (end.getTime() - 1000 * 60 * 60 * 11))
  })

  test('insertBlock', async () => {
    // todo: validate that all txs are within valid time
    const twoDaysAgo = new Date()
    const now = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    const path = blockchain.getBlockPath(now) + '-' + utils.getRandomStr()
    await blockchain.insertBlock(twoDaysAgo, now, path, block.getGenesisBlock().header)

    const blockFile = await github.getFileContent(path)
    const blockObj = block.fromJson(blockFile)

    assert(blockObj.sig.length === 96)
    assert(block.verifySignature(blockObj))

    assert(blockObj.header.no === 2)
    assert(blockObj.header.prevHash.length === 44)
    assert(blockObj.header.txCount >= testData.txs.length)
    assert(blockObj.header.merkleRoot.length === 44)
    // block gets a fresh date object during creation, which should be slightly later than now
    assert(blockObj.header.time.getTime() >= now.getTime())
    assert(blockObj.header.difficulty === 0)
    assert(blockObj.header.nonce === 0)

    assert(blockObj.txs.length >= testData.txs.length)
    assert(blockObj.txs[0].to)
    assert(blockObj.txs[0].from)
    assert(blockObj.txs[0].time)
    assert(blockObj.txs[0].amount)

    // todo: verify genesis in git repo
  })

  test('insertBlockSinceLastOne', async () => {
    // create a block of all txs since genesis
    const tomorrow = new Date() // end search in tomorrow so we can pick up test txs from the database
    tomorrow.setDate(tomorrow.getDate() + 1)
    const path = blockchain.getBlockPath(tomorrow) + '-' + utils.getRandomStr()
    await blockchain.insertBlockSinceLastOne(tomorrow, path, block.getGenesisBlock().header)

    const blockFile = await github.getFileContent(path)
    const blockObj = block.fromJson(blockFile)

    assert(blockObj.sig.length === 96)
    assert(blockObj.header.no === 2)
    assert(blockObj.txs.length >= testData.txs.length)

    // create the consecutive block with same txs in it
    // same txs will be picked up since blocks include txs up to last block creation day's midnight
    // (which will still include today in this test case)
    const path2 = blockchain.getBlockPath(tomorrow) + '-' + utils.getRandomStr()
    await blockchain.insertBlockSinceLastOne(tomorrow, path2)

    const blockFile2 = await github.getFileContent(path2)
    const blockObj2 = block.fromJson(blockFile2)

    assert(blockObj2.sig.length === 96)
    assert(blockObj2.header.no === 3)
    assert(blockObj2.txs.length === blockObj.txs.length)
  })

  test('insertBlockIfRequired', async () => {
    const tomorrow = new Date() // end search in tomorrow so we can pick up test txs from the database
    tomorrow.setDate(tomorrow.getDate() + 1)
    const path = blockchain.getBlockPath(new Date()) + '-' + utils.getRandomStr()
    const inserted = await blockchain.insertBlockIfRequired(path, tomorrow)
    assert(inserted)
    const blockFile = await github.getFileContent(path)
    assert(blockFile.includes('"txs":'))

    // not required
    const inserted2 = await blockchain.insertBlockIfRequired(path, tomorrow)
    assert(!inserted2)
  })
})
