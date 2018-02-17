const assert = require('assert')
const blockchain = require('./blockchain')

suite('blockchain', () => {
  test('getBlockPath', () => {
    const now = new Date()
    const path = blockchain.getBlockPath(now)
    assert(path)
  })

  test('insertBlock', () => {
    assert(blockchain)
  })

  test('insertBlockIfRequired', () => {
    assert(blockchain)
  })

  test('startBlockchainInsertTimer', () => {
    assert(blockchain)
  })
})
