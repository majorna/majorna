const crypto = require('crypto')
const route = require('koa-route')
const config = require('../config/config')
const db = require('../data/db')

/**
 * Accept payments through Coinbase Commerce: https://commerce.coinbase.com/docs/api/#webhooks
 */
exports.coinbaseCommerce = route.post('/webhooks/coinbase-commerce', async ctx => {
  // verify raw payload signature
  const rawBody = ctx.request.rawBody
  const sharedSecret = config.integrations.coinbaseCommerce.webhookSharedSecret
  const sig = ctx.headers['x-cc-webhook-signature']
  const hmac = crypto.createHmac('sha256', sharedSecret)
  hmac.update(rawBody)
  const calculatedSig = hmac.digest('hex')
  if (calculatedSig !== sig) {
    console.log(`Incoming Coinbase Commerce webhook had invalid signature. Expected sig: ${calculatedSig}, got: ${sig}, raw body: ${rawBody}`)
    ctx.throw(401, 'Invalid payload signature.')
  }

  // webhook payload is legit so log the details
  const data = ctx.request.body
  // todo: create test CB account so we won't see test calls in production logs
  console.log('Incoming valid Coinbase Commerce webhook:', JSON.stringify(data, null, 2))

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

  await db.giveMj(userId, usdAmount)

  ctx.status = 200
})
