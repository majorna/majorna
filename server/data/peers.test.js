const assert = require('assert')
const peers = require('./peers')

suite('peers', () => {
  test('addMiner', async () => {
    const miners1 = peers.addMiner('1', 1.123, 4.567)
    assert(miners1.length === 1)
    assert(miners1[0].lat === 1.123)
    assert(miners1[0].lon === 4.567)

    const miners2 = peers.addMiner('2', 8.8, 9.9)
    assert(miners2.length === 2)
    assert(miners2[1].lat === 8.8)
    assert(miners2[1].lon === 9.9)

    const miners3 = peers.addMiner('2', 5.5, 6.6)
    assert(miners3.length === 2)
    assert(miners3[1].lat === 5.5)
    assert(miners3[1].lon === 6.6)

    // make sure these remain unchanged
    assert(miners3[0].lat === 1.123)
    assert(miners3[0].lon === 4.567)
  })

  test.only('initPeer', async () => {
    const miners1 = peers.addMiner('1', 1.123, 4.567)
    const miners2 = peers.addMiner('2', 8.8, 9.9)
  })
})
