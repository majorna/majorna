/**
 * Coinbase Integration:
 * - API ref: https://developers.coinbase.com/api/v2
 *
 * Coinbase Commerce Integration:
 * - API ref: https://commerce.coinbase.com/docs/api/
 */
const axios = require('axios')

exports.createCharge = async userId => {
}

exports.getExchanges = async () => {
  const res = await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=USD')
  assert(res.status === 200)
  assert(res.data.data.rates.BTC)
  assert(res.data.data.rates.ETH)
}
