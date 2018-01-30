const assert = require('assert')
const db = require('../data/db')

test('init', async () => {
  assert(db.testData.users.u1Token)
  // await getRequest().get('/users/init').expect(500)
})
