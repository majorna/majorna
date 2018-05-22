const assert = require('assert')
const querystring = require('querystring')
const axios = require('axios')
const config = require('../config/config')

const usdMultiplier = 100 // stripe represents USD in cents rather than dollars hence the multiplier

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

exports.sampleSuccessfulChargeResponse = {
  id: 'ch_sdafsdff43qasdfasf',
  object: 'charge',
  amount: 100, // 1$ hence 100 cents
  amount_refunded: 0,
  application: null,
  application_fee: null,
  balance_transaction: 'txn_sadfsadfwef23fsadasdf',
  captured: true,
  created: 1526041750,
  currency: 'usd',
  customer: null,
  description: null,
  destination: null,
  dispute: null,
  failure_code: null,
  failure_message: null,
  fraud_details: {},
  invoice: null,
  livemode: true,
  metadata: {},
  on_behalf_of: null,
  order: null,
  outcome: {
    network_status: 'approved_by_network',
    reason: null,
    risk_level: 'normal',
    seller_message: 'Payment complete.',
    type: 'authorized'
  },
  paid: true,
  receipt_email: null,
  receipt_number: null,
  refunded: false,
  refunds: {
    object: 'list',
    data: [],
    has_more: false,
    total_count: 0,
    url: '/v1/charges/ch_sdafsdff43qasdfasf/refunds'
  },
  review: null,
  shipping: null,
  source: {
    id: 'card_sdafsadf332rasdfasd',
    object: 'card',
    address_city: null,
    address_country: null,
    address_line1: null,
    address_line1_check: null,
    address_line2: null,
    address_state: null,
    address_zip: null,
    address_zip_check: null,
    brand: 'Visa',
    country: 'UK',
    customer: null,
    cvc_check: 'pass',
    dynamic_last4: null,
    exp_month: 10,
    exp_year: 2018,
    fingerprint: 'sdfsdfsda32fsdfwe344',
    funding: 'debit',
    last4: '1111',
    metadata: {},
    name: 'abc@abc.com',
    tokenization_method: null
  },
  source_transfer: null,
  statement_descriptor: null,
  status: 'succeeded',
  transfer_group: null
}
