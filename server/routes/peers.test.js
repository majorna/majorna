const assert = require('assert')
const testData = require('../config/test').data

suite('route: miners', () => {
  test('joinMiners', async () => {
    // post location
    const id = testData.users.u1Auth.uid
    const res = await testData.users.u1Request.post('/peers/miners', { id, lat: 0, lon: 123 })
    assert(res.status === 201)
    assert(res.data.miners.find(m => m.lon === 123))

    // update location
    const res2 = await testData.users.u1Request.post('/peers/miners', { id, lat: 1.234, lon: 0 })
    assert(res2.status === 201)
    assert(res2.data.miners.find(m => m.lat === 1.234))

    // invalid request
    const res3 = await testData.users.u1Request.post('/peers/miners', { id, lon: 3.4 })
    assert(res3.status === 400)
    assert(!res3.data.miners)
  })

  test('getPeer', async () => {

  })

  test('signal', async () => {})
})
