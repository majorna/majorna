const assert = require('assert')
const blockchain = require('./blockchain')

suite('blockchain', () => {
  test('getBlockPath', () => {
    const now = new Date()
    const path = blockchain.getBlockPath(now)
    assert(path)
  })

  test('insertBlock', async () => {
    const now = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const path = blockchain.getBlockPath(now)
    await blockchain.insertBlock(now, yesterday, path)
  })

  test('insertBlockIfRequired', () => {
    assert(blockchain)
  })

  test('startBlockchainInsertTimer', () => {
    assert(blockchain)
  })
})
