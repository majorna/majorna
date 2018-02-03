const route = require('koa-route')
const db = require('../data/db')

/**
 * Send majorna to another user.
 */
exports.send = route.post('/txs', async ctx => {
  const tx = ctx.request.body
  ctx.assert(tx.to, 400, '"to" field is required')
  ctx.assert(tx.amount, 400, '"amount" field is required')

  await db.makeTx(ctx.state.user.uid, tx.to, tx.amount)

  ctx.status = 201
})
