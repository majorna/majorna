const assert = require('assert')
const coinbase = require('./coinbase')

suite('coinbase', () => {
  test('createCharge', async () => {
    const hostedUrl = await coinbase.createCharge('123')
    assert(hostedUrl.startsWith('https://commerce.coinbase.com/charges/'))
  })

  test('getUSDExchanges', async () => {
    const exchanges = await coinbase.getUSDExchanges()
    assert((1 / exchanges.BTC) > 5000)
    assert((1 / exchanges.ETH) > 300)
  })
})
