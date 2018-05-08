const assert = require('assert')
const querystring = require('querystring')
const axios = require('axios')
const config = require('../config/config')

const usdMultiplier = 100

/**
 * Creates a Stripe charge with given params.
 * @param token - Token acquired from Stripe checkout or elements.
 * @param amountUsd - Amount in US Dollars (not cents, whole Dollars without fractions).
 * @param amountMj - Matching amount in Majorna.
 * @returns {Promise.<number>} - A promise that resolves to actually charged amount in whole US Dollars.
 */
exports.createCharge = async (token, amountUsd, amountMj) => {
  assert(token, '"token" parameter is required')
  assert(amountUsd, '"amountUsd" parameter is required')
  assert(amountMj, '"amountMj" parameter is required')

  amountUsd = amountUsd * usdMultiplier

  const res = await axios.post('https://api.stripe.com/v1/charges',
    querystring.stringify({
      amount: amountUsd,
      currency: 'usd',
      description: `Purchase of ${amountMj} mj.`,
      source: token
    }),
    {
      auth: {
        username: config.integrations.stripe.secretKey
      }
    })

  assert(res.status === 200)
  assert(res.data.captured)
  assert(res.data.paid)
  assert(config.app.isProd ? res.data.livemode : !res.data.livemode)
  assert(!res.data.refunded)
  return res.data.amount / usdMultiplier
}
