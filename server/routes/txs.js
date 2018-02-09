const route = require('koa-route')
const db = require('../data/db')
const github = require('../data/github')

/**
 * Send majorna to another user.
 */
exports.send = route.post('/txs', async ctx => {
  const tx = ctx.request.body
  ctx.assert(tx.to, 400, '"to" field is required.')
  ctx.assert(tx.amount, 400, '"amount" field is required.')

  // strip address prefix if any
  if (tx.to.startsWith('mj:')) {
    tx.to = tx.to.substring(3)
  } else if (tx.to.startsWith('majorna:')) {
    tx.to = tx.to.substring(8)
  }

  try {
    const txData = await db.makeTx(ctx.state.user.uid, tx.to, tx.amount)
    await github.insertTxInBlock(txData)
  } catch (e) {
    console.error(e)
    ctx.throw(400, 'Failed to make transaction.')
  }

  ctx.status = 201
})
