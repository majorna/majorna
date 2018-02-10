const assert = require('assert')
const testData = require('../config/test').data

suite('route: users', () => {
  test('init', async () => {
    const res = await testData.users.u4Request.get('/users/init')
    assert(res.status === 204)

    // now init same user again and that no error is returned
    const resExisting = await testData.users.u4Request.get('/users/init')
    assert(resExisting.status === 200)

    const resExisting2 = await testData.users.u1Request.get('/users/init')
    assert(resExisting2.status === 200)
  })

  test('get', async () => {
    const res = await testData.users.u1Request.get('/users/2')
    assert(res.status === 200)
    assert(res.data.name === testData.users.u2Doc.name)
    // only 'name' field is returned for requested user
    assert(Object.keys(res.data).length === 1)

    const resInexisting = await testData.users.u1Request.get('/users/92398hsdjhhsd3')
    assert(resInexisting.status === 404)
  })
})
