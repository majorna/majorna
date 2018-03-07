const assert = require('assert')
const testData = require('../config/test').data

suite('route: blocks', () => {
  test('mine', async () => {
    const res = await testData.users.u1Request.get('/blocks/mine')
    assert(res.status === 200)
    assert(res.data.difficulty > 0)
    assert(res.data.headerString.length > 10)
  })
})
