const route = require('koa-route')
const utils = require('../data/utils')
const db = require('../data/db')

/**
 * Send majorna to another user.
 */
exports.send = route.post('/txs', async ctx => {
  const txBody = ctx.request.body
  ctx.assert(txBody.to, 400, '"to" field is required.')
  ctx.assert(txBody.amount, 400, '"amount" field is required.')

  const from = utils.stripPrefix(ctx.state.user.uid)
  const to = utils.stripPrefix(txBody.to)

  await db.makeTx(from, to, txBody.amount, txBody.showSenderName)

  ctx.status = 201
})
