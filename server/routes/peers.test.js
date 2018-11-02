const assert = require('assert')
const testData = require('../config/test').data

suite('route: miners', () => {
  test('joinMiners', async () => {
    // post location
    const id = testData.users.u1Auth.uid
    const res = await testData.users.u1Request.post('/peers', { id, lat: 0, lon: 123888999 })
    assert(res.status === 201)
    assert(res.data.miners.find(m => m.lon === 123888999))

    // update location
    const res2 = await testData.users.u1Request.post('/peers', { id, lat: 1.234098786512, lon: 0 })
    assert(res2.status === 201)
    assert(res2.data.miners.find(m => m.lat === 1.234098786512))

    // invalid request
    const res3 = await testData.users.u1Request.post('/peers', { id, lon: 3.498709328723 })
    assert(res3.status === 400)
    assert(!res3.data.miners)
  })

  test('getPeer', async () => {
  })

  test('signal', async () => {
  })
})
