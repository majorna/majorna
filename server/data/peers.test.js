const assert = require('assert')
const peers = require('./peers')

suite.only('peers', () => {
  test('initPeer', async () => {
    assert(peers)
  })
})
