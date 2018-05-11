const assert = require('assert')
const querystring = require('querystring')
const axios = require('axios')
const config = require('../config/config')

const usdMultiplier = 100

/**
 * Creates a Stripe charge with given params.
 * @param token - Token acquired from Stripe checkout or elements.
 * @param usdAmount - Amount in US Dollars (not cents, whole Dollars without fractions).
 * @returns {Promise.<number>} - A promise that resolves to actually charged amount in whole US Dollars.
 */
exports.createCharge = async (token, usdAmount) => {
  assert(token, '"token" parameter is required')
  assert(usdAmount, '"usdAmount" parameter is required')

  usdAmount = usdAmount * usdMultiplier

  const res = await axios.post('https://api.stripe.com/v1/charges',
    querystring.stringify({
      amount: usdAmount,
      currency: 'usd',
      source: token
    }),
    {
      auth: {
        username: config.integrations.stripe.secretKey
      }
    })

  // todo: assertions errors need meaning messages as they are shown to users
  // also need to capture axios errors and send to UI (or better, use a hosted payment provider and never bother with these!)
  assert(res.status === 200)
  assert(res.data.captured)
  assert(res.data.paid)
  assert(config.app.isProd ? res.data.livemode : !res.data.livemode)
  assert(!res.data.refunded)

  console.log('Stripe: successful charge:', res.data)

  return res.data.amount / usdMultiplier
}
