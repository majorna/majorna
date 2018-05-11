const assert = require('assert')
const testData = require('../config/test').data

suite('route: shop', () => {
  test('createStripeCharge', async () => {
    const res = await testData.users.u1Request.post('/shop/stripe-charge', {
      token: 'tok_visa',
      usdAmount: 10
    })
    assert(res.status === 201)
  })

  test('coinbaseCommerceChargeUrl', async () => {
    const res = await testData.users.u1Request.get('/shop/coinbase-commerce-charge-url')
    assert(res.status === 200)
    assert(res.data.chargeUrl)
  })
})
