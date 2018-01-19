const db = require('server/data/db')

test('updateMarketCap', async () => {
  await db.updateMarketCap(500)
})
