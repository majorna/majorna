const assert = require('assert')
const axios = require('axios')
const config = require('../config/config')

exports.createCharge = async (token, amountUsd, amountMj) => {
  assert(token, '"token" parameter is required')
  assert(amountUsd, '"amountUsd" parameter is required')
  assert(amountMj, '"amountMj" parameter is required')

  const res = await axios.post('https://api.stripe.com/v1/charges',
    {
      amount: amountUsd,
      currency: 'usd',
      description: `Purchase of ${amountMj} mj.`,
      source: token,
    },
    {
      auth: {
        username: config.integrations.stripe.secretKey,
        password: ''
      }
    })

  assert(res.status === 201)
  assert(res.data.captured)
  assert(res.data.paid)
  assert(!config.app.isProd && !res.data.livemode)
  assert(config.app.isProd && res.data.livemode)
  assert(!res.data.refunded)
  return res.data.amount
}