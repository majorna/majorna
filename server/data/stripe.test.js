const assert = require('assert')
const stripe = require('./stripe')

suite.skip('stripe', () => {
  test('createCharge', async () => {
    const amount = await stripe.createCharge('tok_visa', 10)
    assert(amount === 10)
  })
})
