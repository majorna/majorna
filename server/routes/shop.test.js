const assert = require('assert')
const testData = require('../config/test').data

suite('route: shop', () => {
  test('webhooks/coinbase-commerce', async () => {
    const res = await testData.users.u1Request.get('/users/2')
    assert(res.status === 200)
    assert(res.data.name === testData.users.u2Doc.name)
    // only 'name' field is returned for requested user
    assert(Object.keys(res.data).length === 1)

    const resInexisting = await testData.users.u1Request.get('/users/92398hsdjhhsd3')
    assert(resInexisting.status === 404)
  })
})
