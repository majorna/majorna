const db = require('./db')

test('getMeta', async () => {
  const meta = await db.getMeta()
  expect(meta.cap >= 500)
  expect(meta.val >= 0)
})

test('updateMarketCap', async () => {
  const meta = await db.getMeta()
  const txPromise = await db.updateMarketCap(500)
  expect(txPromise).toBeTruthy()
  const meta2 = await db.getMeta()
  expect(meta2.cap).toBe(meta.cap + 500)
})
