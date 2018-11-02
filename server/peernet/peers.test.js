const assert = require('assert')
const peers = require('./peers')
const db = require('../data/db')

suite('peers', () => {
  test('addMiner', () => {
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

  test('getPeer', () => {
    // can never return user self back to himself
    peers.addMiner('1', 1.123, 4.567)
    assert.throws(() => peers.getPeer('1'), e => e.message === 'no available miners')

    peers.addMiner('2', 8.8, 9.9)
    for (let i = 0; i < 10; i++) assert(peers.getPeer('1').userId === '2')

    peers.addMiner('3', 8.85, 9.95)
    for (let i = 0; i < 10; i++) {
      const peerId = peers.getPeer('1').userId
      assert(peerId === '2' || peerId === '3')
    }
  })

  test('signal', async () => {
    peers.addMiner('2', 8.8, 9.9)

    const from = '1'
    const to = '2'
    const signalData = { wow: 'yeah' }

    await assert.rejects(() => peers.signal(from, 'def123', signalData), e => e.message.includes('miner with ID: def123'))

    await peers.signal(from, to, signalData)
    const userDoc = await db.getUser(to)
    const notification = userDoc.notifications.pop()
    assert(notification.type === 'webRTCSignal')
    assert(notification.data.userId === from)
    assert(notification.data.signalData.wow === signalData.wow)
  })
})
