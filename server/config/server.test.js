const assert = require('assert')
const testData = require('../config/test').data

// todo: verify unauthorized request = 401 etc.
// todo: verify valid token auth
// todo: verify server crash/exception from route

suite('server-config', () => {
  test('invalid token auth', async () => {
    const res = await testData.users.anonRequest.get('/users/init')
    assert(res.status === 401)
  })
})
