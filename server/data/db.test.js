const assert = require('assert')
const db = require('./db')
const testData = require('../config/test').data

suite('db', () => {
  test('init', async () => {
    await db.init()
    await db.init()
  })

  test('getMeta', async () => {
    const meta = await db.getMeta()
    assert(meta.cap >= 500)
    assert(meta.val >= 0)
  })

  test('createUserDoc', async () => {
    const uid = '3'
    const userData = testData.users.u3Doc
    const meta = await db.getMeta()

    await db.createUserDoc(userData, uid)

    // verify market cap increase
    const metaAfter = await db.getMeta()
    assert(metaAfter.cap === meta.cap + 500)

    // verify user doc fields
    const userDoc = await db.getUser(uid)
    assert(userDoc.email === userData.email)
    assert(userDoc.name === userData.name)
    // todo: this time is off by 10-15s for some reason! in future they will add local version of server timestamp approximation
    assert(userDoc.created.getTime() + 20 * 1000 > userData.created.getTime())
    assert(userDoc.created.getTime() - 20 * 1000 < userData.created.getTime())
    assert(userDoc.balance === userData.balance)
    assert(userDoc.txs.length === 1)

    // verify tx in txs collection
    const tx = await db.getTx(userDoc.txs[0].id)
    assert(tx.from === 'majorna')
    assert(tx.to === uid)
    assert(tx.sent.getTime() === userDoc.created.getTime())
    assert(tx.amount === 500)
  })

  // todo: make valid and invalid txs
  // todo: verify all changes to sender and receiver are complete (balanced updated, arrays updated, txs doc updated etc.)

  test('makeTx, getTx', async () => {
    // make a valid tx
    const now = new Date()
    await db.makeTx('1', '2', now, 100)


  })
})
