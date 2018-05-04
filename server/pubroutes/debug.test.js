const assert = require('assert')
const testData = require('../config/test').data

suite('pubroute: debug', () => {
  test('ping', async () => {
    const res = await testData.users.anonRequest('/ping')
    assert(res.status === 200)
    assert(res.data === 'pong')
  })
})
