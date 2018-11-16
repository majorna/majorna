const assert = require('assert')
const peers = require('./peers')
const db = require('../data/db')

suite('peers', () => {
  test('addPeer', () => {
    peers.purgePeers()

    const peers1 = peers.addPeer('1', 1.123, 4.567)
    assert(peers1.length === 1)
    assert(peers1[0].lat === 1.123)
    assert(peers1[0].lon === 4.567)

    const peers2 = peers.addPeer('2', 8.8, 9.9)
    assert(peers2.length === 2)
    assert(peers2[1].lat === 8.8)
    assert(peers2[1].lon === 9.9)

    const peers3 = peers.addPeer('2', 5.5, 6.6)
    assert(peers3.length === 2)
    assert(peers3[1].lat === 5.5)
    assert(peers3[1].lon === 6.6)

    // make sure these remain unchanged
    assert(peers3[0].lat === 1.123)
    assert(peers3[0].lon === 4.567)
  })

  test('getPeer', () => {
    peers.purgePeers()
    assert.throws(() => peers.getPeer('1'), e => e.message === 'no available peers')

    // can never return user self back to himself
    peers.addPeer('1', 1.123, 4.567)
    assert.throws(() => peers.getPeer('1'), e => e.message === 'no available peers')

    peers.addPeer('2', 8.8, 9.9)
    for (let i = 0; i < 10; i++) assert(peers.getPeer('1').userId === '2')

    peers.addPeer('3', 8.85, 9.95)
    for (let i = 0; i < 10; i++) {
      const peerId = peers.getPeer('1').userId
      assert(peerId === '2' || peerId === '3')
    }

    // connection to self in test mode
    assert(peers.getPeer('1', true).userId === '1')
  })

  test('signal', async () => {
    peers.purgePeers()
    peers.addPeer('2', 8.8, 9.9)

    const from = '1'
    const to = '2'
    const signalData = { wow: 'yeah' }

    await assert.rejects(() => peers.signal(from, 'def123', signalData), e => e.message.includes('peer with ID: def123'))

    await peers.signal(from, to, signalData)
    const userDoc = await db.getUser(to)
    const notification = userDoc.notifications.pop()
    assert(notification.type === 'webRTCSignal')
    assert(notification.data.userId === from)
    assert(notification.data.signalData.wow === signalData.wow)
  })
})
