const assert = require('assert')
const db = require('./db')

test('init', async () => {
  await db.init()
})

test('getMeta', async () => {
  const meta = await db.getMeta()
  assert(meta.cap >= 500)
  assert(meta.val >= 0)
})

test('updateMarketCap', async () => {
  const meta = await db.getMeta()
  await db.updateMarketCap(500)
  const meta2 = await db.getMeta()
  assert(meta2.cap === meta.cap + 500)
})

test('addTx, getTx', async () => {
  // valid and invalid txs
})

test('createUserDoc', async () => {
  await db.createUserDoc(db.testData.users.u3Doc, '3')
  // todo: get user doc and verify fields
  // todo: verify market cap
  // todo: verify txs collection
})
