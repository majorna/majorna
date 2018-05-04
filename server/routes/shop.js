const route = require('koa-route')
const coinbase = require('../data/coinbase')

/**
 * Retrieves user specific Coinbase Commerce charge URL.
 */
exports.coinbaseCommerceChargeUrl = route.get('/shop/coinbase-commerce-charge-url', async ctx => {
  const chargeUrl = await coinbase.createCharge(ctx.state.user.uid)
  ctx.body = {chargeUrl}
})
