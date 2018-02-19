const assert = require('assert')
const blockchain = require('./blockchain')
const github = require('../data/github')
const crypto = require('./crypto')

suite('blockchain', () => {
  test('getBlockPath', () => {
    const now = new Date()
    const path = blockchain.getBlockPath(now)
    assert(path)
  })

  test('getBlockTimeRange', () => {
    // todo: write me
  })

  test('insertBlock', async () => {
    const now = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const path = blockchain.getBlockPath(now) + '-' + Math.random()
    await blockchain.insertBlock(now, yesterday, path)

    const blockFile = await github.getFileContent(path)
    assert(blockFile.includes('"data":'))
    const block = JSON.parse(blockFile)
    assert(crypto.verifyText(JSON.stringify(block.data), block.sig))
  })

  test('insertBlockIfRequired', async () => {
    const path = blockchain.getBlockPath(new Date()) + '-' + Math.random()
    const inserted = await blockchain.insertBlockIfRequired(path)
    assert(inserted)
    const block = await github.getFileContent(path)
    assert(block.includes('"data":'))

    // not required
    const inserted2 = await blockchain.insertBlockIfRequired(path)
    assert(!inserted2)
  })

  test('startBlockchainInsertTimer', () => {
    const timer = blockchain.startBlockchainInsertTimer(1)
    clearInterval(timer)
  })
})
