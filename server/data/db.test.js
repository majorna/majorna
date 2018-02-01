const assert = require('assert')
const db = require('./db')
const testData = require('../config/test').data

suite('db', () => {
  test('init', async () => {
    await db.init()
  })

  test('getMeta', async () => {
    const meta = await db.getMeta()
    assert(meta.cap >= 500)
    assert(meta.val >= 0)
  })

  test('makeTx, getTx', async () => {
    // todo: valid and invalid txs
    // todo: verify all changes to sender and receiver are complete (balanced updated, arrays updated, txs doc updated etc.)
  })

  test('createUserDoc', async () => {
    // todo: get user doc and verify fields
    // todo: verify market cap
    // todo: verify txs collection
    const meta = await db.getMeta()

    await db.createUserDoc(testData.users.u3Doc, '3')

    const metaAfter = await db.getMeta()
    assert(metaAfter.cap === meta.cap + 500)
  })
})
