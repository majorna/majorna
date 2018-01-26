const testSetup = require('../config/test-setup')
const db = require('./db')

beforeAll(testSetup.init)

test('init', async () => {
})

test('getMeta', async () => {
  const meta = await db.getMeta()
  expect(meta.cap >= 500)
  expect(meta.val >= 0)
})

test('updateMarketCap', async () => {
  const meta = await db.getMeta()
  await db.updateMarketCap(500)
  const meta2 = await db.getMeta()
  expect(meta2.cap).toBe(meta.cap + 500)
})

test('addTx, getTx', async () => {
  // valid and invalid txs
})

test('createUserDoc', async () => {
  await db.createUserDoc({
    uid: '2',
    email: 'morgan.almighty@majorna',
    name: 'Morgan Almighty'
  })
})
