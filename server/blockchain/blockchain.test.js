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

  test.only('getBlockTimeRange', () => {
    const now = new Date('2018-02-15T10:00:00.000Z')
    console.log(now)
    const goBackDays = 5
    const range = blockchain.getBlockTimeRange(now, goBackDays)

    // time between {now} and {end} is 10 hours
    assert(range.end.getTime() === (now.getTime() - 1000 * 60 * 60 * 10))

    // time between {start} and {end} is xxx hours
    assert(range.start.getTime() === (range.end.getTime() - 1000 * 60 * 60 * 24 * 5))
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
