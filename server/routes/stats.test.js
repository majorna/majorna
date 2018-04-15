const assert = require('assert')
const testData = require('../config/test').data

suite('route: stats', () => {
  test('get', async () => {
    // post location
    const res = await testData.users.u1Request.get('/stats')
    assert(res.status === 200)
    assert(res.data.daily)
  })
})
