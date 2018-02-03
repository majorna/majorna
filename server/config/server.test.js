const assert = require('assert')
const testData = require('../config/test').data

suite('server-config', () => {
  test('valid token auth', async () => {
    const res = await testData.users.u1Request.get('/ping')
    assert(res.status === 200)
    assert(res.data === 'pong')
  })

  test('receive valid cors headers', async () => {
    const res = await testData.users.anonRequest.options('/users/init', {
      headers: {
        'Origin': 'randomOrigin',
        'Access-Control-Request-Method': 'GET'
      }
    })
    assert(res.status === 204)
    assert(res.headers['access-control-allow-origin'] === 'randomOrigin')
    assert(res.headers['access-control-allow-methods'].includes('GET'))
  })

  test('no token auth', async () => {
    const res = await testData.users.anonRequest.get('/users/init')
    assert(res.status === 401)

    const res2 = await testData.users.anonRequest.get('/users/abcRandosadf234m123')
    assert(res2.status === 401)

    const res3 = await testData.users.anonRequest.get('/asfs32434daf')
    assert(res3.status === 401)
  })

  test('invalid token auth', async () => {
    const res = await testData.users.anonRequest.get('/users/init', {headers: {'Authorization': 'Bearer abc'}})
    assert(res.status === 401)

    const res2 = await testData.users.anonRequest.get('/098gjhsdaf91', {headers: {'Authorization': 'Bea'}})
    assert(res2.status === 401)
  })

  test('invalid route with valid token', async () => {
    const res = await testData.users.u1Request.get('/users/po09879234ghsdaf')
    assert(res.status === 404)

    const res2 = await testData.users.u1Request.get('/kjlh3498udfsaf')
    assert(res2.status === 404)
  })
})
