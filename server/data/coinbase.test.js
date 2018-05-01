const assert = require('assert')
const coinbase = require('./coinbase')

suite.only('coinbase', () => {
  test('createCharge', async () => {
    const hostedUrl = await coinbase.createCharge('123')
    assert(hostedUrl)
  })
})
