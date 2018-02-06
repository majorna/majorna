const assert = require('assert')
const db = require('../data/db')
const testData = require('../config/test').data

suite('route: txs', () => {
  test('valid tx', async () => {
    const res = await testData.users.u1Request.post('/txs', {
      to: '2',
      amount: 100
    })
    assert(res.status === 201)

    // validate at least one field even though db tests validate everything
    const sender = await db.getUser('1')
    assert(sender.balance === testData.users.u1Doc.balance - 200)
  })

  test('invalid tx', async () => {
    let res = await testData.users.u1Request.post('/txs', {
      to: '1'
    })
    assert(res.status === 400)

    res = await testData.users.u1Request.post('/txs', {
      amount: 100
    })
    assert(res.status === 400)

    res = await testData.users.u1Request.post('/txs', {
      to: '-098dsayfo883',
      amount: 100
    })
    assert(res.status === 400)

    res = await testData.users.u1Request.post('/txs', {
      to: '1',
      amount: 100
    })
    assert(res.status === 400)
  })
})
