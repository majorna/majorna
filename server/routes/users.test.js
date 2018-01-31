const assert = require('assert')
const testData = require('../config/test').data

suite('users-route', () => {
  test('init', async () => {
    const res = await testData.users.u4Request.get('/users/init')
    assert(res.status === 204)
  })
})
