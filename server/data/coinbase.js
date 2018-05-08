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

/**
 * Creates a Coinbase Commerce charge with given user ID in charge metadata and returns the charge URL.
 * Webhook events for this charge will include the same user ID in their metadata.
 */
exports.createCharge = async userId => {
  assert(userId, 'use ID parameter is required')

  const res = await axios.post('https://api.commerce.coinbase.com/charges',
    {
      name: 'Majorna',
      description: 'Buy Majorna using other cryptocurrencies.',
      logo_url: config.app.logoUrl,
      redirect_url: config.app.url,
      pricing_type: 'no_price',
      metadata: { userId: userId }
    },
    {
      headers: {
        'X-CC-Api-Key': config.integrations.coinbaseCommerce.apiKey,
        'X-CC-Version': '2018-03-22'
      }
    })

  assert(res.status === 201)
  assert(res.data.data.metadata.userId === userId)
  return res.data.data.hosted_url
}

/**
 * Retrieves conversion rates for USD -> other currencies.
 * Example:
 * USD -> BTC: 0.00011100
 * BTC -> USD: 1/0.00011100 = 9009
 */
exports.getUSDExchanges = async () => {
  const res = await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=USD')
  assert(res.status === 200)
  assert(res.data.data.rates.BTC)
  assert(res.data.data.rates.ETH)
  return res.data.data.rates
}
