const route = require('koa-route')
const stripe = require('../data/stripe')
const coinbase = require('../data/coinbase')
const db = require('../data/db')

/**
 * Charges a card through Stripe.
 */
exports.createStripeCharge = route.post('/shop/stripe-charge', async ctx => {
  const charge = ctx.request.body
  const chargedUsdAmount = await stripe.createCharge(charge.token, charge.usdAmount)

  await db.giveMj(ctx.state.user.uid, chargedUsdAmount)

  ctx.status = 201
})

/**
 * Retrieves user specific Coinbase Commerce charge URL.
 */
exports.coinbaseCommerceChargeUrl = route.get('/shop/coinbase-commerce-charge-url', async ctx => {
  const chargeUrl = await coinbase.createCharge(ctx.state.user.uid, ctx.state.user.name)
  ctx.body = {chargeUrl}
})
