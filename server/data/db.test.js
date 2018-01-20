const db = require('./db')

test('getMeta', async () => {
  const meta = await db.getMeta()
  expect(meta.cap >= 500)
  expect(meta.val >= 0)
})

test('updateMarketCap', async () => {
  const meta = await db.getMeta()
  await db.updateMarketCap(500)
  const meta2 = await db.getMeta()
  expect(meta.cap === meta2.cap - 500)
})
