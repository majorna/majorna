const assert = require('assert')
const db = require('./db')

it('init', async () => {
  await db.init()
})

it('getMeta', async () => {
  const meta = await db.getMeta()
  assert(meta.cap >= 500)
  assert(meta.val >= 0)
})

it('updateMarketCap', async () => {
  const meta = await db.getMeta()
  await db.updateMarketCap(500)
  const meta2 = await db.getMeta()
  assert(meta2.cap === meta.cap + 500)
})

it('addTx, getTx', async () => {
  // valid and invalid txs
})

it('createUserDoc', async () => {
  await db.createUserDoc({
    uid: '3',
    email: 'john.doe@majorna.mj',
    name: 'John Doe'
  })
})
