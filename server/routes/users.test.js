const db = require('../data/db')

test('init', async () => {
  await db.testData.users.u1Request.get('/users/init').expect(200)
})
