const route = require('koa-route')
const db = require('../data/db')
const github = require('../data/github')
const crypto = require('../data/crypto')

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

  const txData = await db.makeTx(ctx.state.user.uid, tx.to, tx.amount)
  const signedTx = crypto.signTx(txData)
  await github.insertTxInBlock(signedTx)
  // todo: try github insert again if it fails -or- queue it

  ctx.status = 201
})
