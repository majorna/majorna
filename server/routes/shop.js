const route = require('koa-route')
// const config = require('../config/config')

/**
 * Accept payments through Coinbase Commerce: https://commerce.coinbase.com/docs/api/#webhooks
 */
exports.coinbaseCommerce = route.post('/shop/webhooks/coinbase-commerce', async ctx => {
  // verify raw payload signature
  // const sharedSecret = config.integrations.coinbaseCommerce.webhookSharedSecret
  // const sig = ctx.headers['X-CC-Webhook-Signature']
  // const payload = ctx.request.rawBody
  //
  // // webhook payload is legit so log the details
  const data = ctx.request.body
  // console.log('Incoming Coinbase Commerce webhook:', data)
  //
  if (data.event.type !== 'charge:confirmed') {
    // need to return 200 otherwise coinbase retries
    ctx.status = 200
    return
  }

  // event data is charge resource: https://commerce.coinbase.com/docs/api/#charge-resource
  const charge = data.event.data
  if (charge.metadata.userId) {
    const lastPayment = charge.payments.pop()
    if (lastPayment.value.crypto.currency.BTC) {
      // (lastPayment.value.crypto.value
    }
    // check coinbase for spot prices and convert all incoming payments
    // (a transaction can have payments in multiple cryptos with different amounts)
  }


  // todo: check if sending BTC, some more BTC, then ETH causes webhook to get called with same info and updated figures
  // (which would cause double buy)

  ctx.status = 200
})
