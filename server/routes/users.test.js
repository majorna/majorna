const assert = require('assert')
const db = require('../data/db')

test('init', async () => {
  const res = await db.testData.users.u1Request.get('/users/init')
  assert(res)
  console.log(res)
})
