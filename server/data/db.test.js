const db = require('./db')

test('updateMarketCap', async () => {
  await db.updateMarketCap(500)
})
