const assert = require('assert')
const testData = require('../config/test').data

// todo: try to create existing user and validate http 400

suite('users-route', () => {
  test('init', async () => {
    const res = await testData.users.u4Request.get('/users/init')
    assert(res.status === 204)
  })
})
