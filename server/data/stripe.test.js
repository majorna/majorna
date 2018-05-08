const assert = require('assert')
const stripe = require('./stripe')

suite('stripe', () => {
  test('createCharge', async () => {
    const amount = await stripe.createCharge('tok_visa', 10, 100)
    assert(amount === 10)
  })
})
