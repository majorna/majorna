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

  test.only('createUserDoc', async () => {
    // todo: verify txs collection
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
    // todo: this time is off by 10-15s for some reason!
    assert(userDoc.created.getTime() + 20 * 1000 > userData.created.getTime())
    assert(userDoc.created.getTime() - 20 * 1000 < userData.created.getTime())
    assert(userDoc.balance === userData.balance)
  })

  test('makeTx, getTx', async () => {
    // todo: valid and invalid txs
    // todo: verify all changes to sender and receiver are complete (balanced updated, arrays updated, txs doc updated etc.)
  })
})
