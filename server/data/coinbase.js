/**
 * Coinbase Integration:
 * - API ref: https://developers.coinbase.com/api/v2
 *
 * Coinbase Commerce Integration:
 * - API ref: https://commerce.coinbase.com/docs/api/
 */
const assert = require('assert')
const axios = require('axios')
const config = require('../config/config')

exports.createCharge = async userId => {
  assert(userId, 'use ID parameter is required')

  const res = await axios.post('https://api.commerce.coinbase.com/charges', {
    headers: {
      'X-CC-Api-Key': config.integrations.coinbaseCommerce.apiKey,
      'X-CC-Version': '2018-03-22'
    },
    data: {
      name: 'Majorna',
      description: 'Get Majorna using other cryptos.',
      logo_url: config.app.logoUrl,
      redirect_url: config.app.url,
      pricing_type: 'no_price',
      metadata: { userId: userId }
    }
  })

  assert(res.data.data.metadata.userId === userId)
  return res.data.data.hosted_url
}

exports.getExchanges = async () => {
  const res = await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=USD')
  assert(res.status === 200)
  assert(res.data.data.rates.BTC)
  assert(res.data.data.rates.ETH)
}
