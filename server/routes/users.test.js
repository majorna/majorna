const assert = require('assert')
const testData = require('../config/test').data

// todo: try to create existing user and validate http 400
// todo: get user (positive 200 and negative 404)

suite('route: users', () => {
  test('init', async () => {
    const res = await testData.users.u4Request.get('/users/init')
    assert(res.status === 204)
  })
})
