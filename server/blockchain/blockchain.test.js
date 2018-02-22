const assert = require('assert')
const blockchain = require('./blockchain')
const github = require('../data/github')
const crypto = require('./crypto')
const block = require('./block')

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

  test.only('insertBlockSinceLastOne', async () => {
    // create a block of all txs since genesis
    const tomorrow = new Date() // tomorrow so we can pick up test txs from the database
    tomorrow.setDate(tomorrow.getDate() + 1)
    const path = blockchain.getBlockPath(tomorrow) + '-' + Math.random()
    await blockchain.insertBlockSinceLastOne(tomorrow, path, block.genesisBlock.header)
    // todo: get and verify

    // create the consecutive block with no txs in it
    const now = new Date()
    const path2 = blockchain.getBlockPath(now) + '-' + Math.random()
    await blockchain.insertBlockSinceLastOne(now, path2)
    // todo: get and verify
  })

  // test('insertBlockIfRequired', async () => {
  //   const path = blockchain.getBlockPath(new Date()) + '-' + Math.random()
  //   const inserted = await blockchain.insertBlockIfRequired(path)
  //   assert(inserted)
  //   const blockFile = await github.getFileContent(path)
  //   assert(blockFile.includes('"data":'))
  //
  //   // not required
  //   const inserted2 = await blockchain.insertBlockIfRequired(path)
  //   assert(!inserted2)
  // })
  //
  // test('startBlockchainInsertTimer', () => {
  //   const timer = blockchain.startBlockchainInsertTimer(1)
  //   clearInterval(timer)
  // })
})
