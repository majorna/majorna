const assert = require('assert')
const blockchain = require('./blockchain')
const github = require('../data/github')
const crypto = require('./crypto')
const block = require('./block')
const testData = require('../config/test').data

suite('blockchain', () => {
  test('getBlockPath', () => {
    const now = new Date()
    const path = blockchain.getBlockPath(now)
    assert(path)
  })

  test('getBlockTimeRange', () => {
    const start = new Date('2018-02-15T10:00:00.000Z')
    const end = new Date('2018-02-20T11:00:00.000Z')
    const range = blockchain.getBlockTimeRange(start, end)

    assert(range.start.getTime() === (range.end.getTime() - 1000 * 60 * 60 * 24 * 5))
    assert(range.start.getTime() === (start.getTime() - 1000 * 60 * 60 * 10))
    assert(range.end.getTime() === (end.getTime() - 1000 * 60 * 60 * 11))
  })

  test('insertBlock', async () => {
    const now = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const path = blockchain.getBlockPath(now) + '-' + Math.random()
    await blockchain.insertBlock(now, yesterday, path, block.genesisBlock)

    const blockFile = await github.getFileContent(path)
    assert(blockFile.includes('"data":'))
    const blockObj = JSON.parse(blockFile)
    assert(crypto.verifyObj(blockObj.header, blockObj.sig))
  })

  test('insertBlockSinceLastOne', async () => {
    const now = new Date()

    // create a block of all txs since genesis
    const tomorrow = new Date() // tomorrow so we can pick up test txs from the database
    tomorrow.setDate(tomorrow.getDate() + 1)
    const path = blockchain.getBlockPath(tomorrow) + '-' + Math.random()
    await blockchain.insertBlockSinceLastOne(tomorrow, path, block.genesisBlock.header)

    const blockFile = await github.getFileContent(path)
    const blockObj = JSON.parse(blockFile)

    assert(blockObj.sig.length === 96)

    assert(blockObj.header.no === 2)
    assert(blockObj.header.prevHash.length === 44)
    assert(blockObj.header.txCount >= testData.txs.length)
    assert(blockObj.header.merkleRoot.length === 44)
    // block gets a fresh date object during creation, which should be slightly later than now
    assert(Date.parse(blockObj.header.time) >= now.getTime())
    assert(blockObj.header.difficulty > 0)
    assert(blockObj.header.nonce > 0)

    assert(blockObj.data.length >= testData.txs.length)
    assert(blockObj.data[0].to)
    assert(blockObj.data[0].from)
    assert(blockObj.data[0].time)
    assert(blockObj.data[0].amount)

    // create the consecutive block with no txs in it
    const today = new Date()
    const path2 = blockchain.getBlockPath(today) + '-' + Math.random()
    await blockchain.insertBlockSinceLastOne(today, path2)

    const blockFile2 = await github.getFileContent(path2)
    const blockObj2 = JSON.parse(blockFile2)

    assert(blockObj2.sig.length === 96)
    assert(blockObj2.header)
    assert(blockObj2.data.length === 0)
  })

  test('insertBlockIfRequired', async () => {
    const path = blockchain.getBlockPath(new Date()) + '-' + Math.random()
    const inserted = await blockchain.insertBlockIfRequired(path)
    assert(inserted)
    const blockFile = await github.getFileContent(path)
    assert(blockFile.includes('"data":'))

    // not required
    const inserted2 = await blockchain.insertBlockIfRequired(path)
    assert(!inserted2)
  })

  test('startBlockchainInsertTimer', () => {
    const timer = blockchain.startBlockchainInsertTimer(1)
    clearInterval(timer)
  })
})
