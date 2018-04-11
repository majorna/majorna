const assert = require('assert')
const testData = require('../config/test').data

suite('route: miners', () => {
  test('post', async () => {
    const id = testData.users.u1Auth.uid
    const res = await testData.users.u1Request.post('/miners', {id, lat: 0, lon: 123})
    assert(res.status === 201)
    assert(res.data.miners.find(m => m.id === id))
  })
})
