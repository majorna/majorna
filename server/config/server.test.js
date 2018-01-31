const assert = require('assert')
const testData = require('../config/test').data

// todo: verify valid token auth
// todo: verify server crash/exception from route

suite('server-config', () => {
  test('no token auth', async () => {
    const res = await testData.users.anonRequest.get('/users/init')
    assert(res.status === 401)
  })

  test('invalid token auth', async () => {
    const res = await testData.users.anonRequest.get('/users/init', {headers: {'Authorization': 'Bearer abc'}})
    assert(res.status === 401)

    const res2 = await testData.users.anonRequest.get('/users/init', {headers: {'Authorization': 'Bea'}})
    assert(res2.status === 401)
  })
})
