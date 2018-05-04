const crypto = require('crypto')
const route = require('koa-route')
const config = require('../config/config')
const coinbase = require('../data/coinbase')
const db = require('../data/db')

/**
 * Accept payments through Coinbase Commerce: https://commerce.coinbase.com/docs/api/#webhooks
 */
exports.coinbaseCommerce = route.post('/shop/webhooks/coinbase-commerce', async ctx => {
  // verify raw payload signature
  const rawBody = ctx.request.rawBody
  const sharedSecret = config.integrations.coinbaseCommerce.webhookSharedSecret
  const sig = ctx.headers['X-CC-Webhook-Signature']
  const hmac = crypto.createHmac('sha256', sharedSecret)
  hmac.update(rawBody)
  const calculatedSig = hmac.digest('hex')
  if (calculatedSig !== sig) {
    console.log(`Incoming Coinbase Commerce webhook had invalid signature. Expected sig: ${sig}, got: ${calculatedSig}, raw body: ${rawBody}`)
    ctx.throw(401, 'Invalid payload signature.')
  }

  // webhook payload is legit so log the details
  const data = ctx.request.body
  console.log('Incoming Coinbase Commerce webhook:', data)

  if (data.event.type !== 'charge:confirmed') {
    // need to return 200 otherwise coinbase retries
    ctx.status = 200
    return
  }

  // event data is charge resource: https://commerce.coinbase.com/docs/api/#charge-resource
  const charge = data.event.data
  const userId = charge.metadata.userId
  const lastPayment = charge.payments.pop()
  if (lastPayment.value.local.currency !== 'USD') {
    throw new Error(`Expected Coinbase Commerce payment in USD, got: ${lastPayment.value.local.currency}`)
  }
  const usdAmount = lastPayment.value.local.amount

  await db.purchaseMj(userId, usdAmount)

  ctx.status = 200
})

/**
 * Retrieves user specific Coinbase Commerce charge URL.
 */
exports.coinbaseCommerceChargeUrl = route.get('/shop/coinbase-commerce-charge-url', async ctx => {
  const chargeUrl = await coinbase.createCharge(ctx.state.user.uid)
  ctx.body = {chargeUrl}
})
