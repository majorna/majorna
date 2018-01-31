const assert = require('assert')
const testData = require('../config/test').data

test('init', async () => {
  const res = await testData.users.u1Request.get('/users/init')
  assert(res)
  console.log(res)
})
