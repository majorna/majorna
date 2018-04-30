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
  // const data = ctx.request.body
  // console.log('Incoming Coinbase Commerce webhook:', data)
  //
  // if (data.event.type === 'charge:confirmed') {
  //   // check coinbase for spot prices and convert all incoming payments
  //   // (a transaction can have payments in multiple cryptos with different amounts)
  // }

  // need to return 200 otherwise coinbase retries

  // todo: check if sending BTC, some more BTC, then ETH causes webhook to get called with same info and updated figures
  // (which would cause double buy)
})
