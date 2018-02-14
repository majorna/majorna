const route = require('koa-route')
const tx = require('../data/tx')

/**
 * Send majorna to another user.
 */
exports.send = route.post('/txs', async ctx => {
  const txBody = ctx.request.body
  ctx.assert(txBody.to, 400, '"to" field is required.')
  ctx.assert(txBody.amount, 400, '"amount" field is required.')

  await tx.makeTx(ctx.state.user.uid, txBody.to, txBody.amount)

  ctx.status = 201
})
