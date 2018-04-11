const route = require('koa-route')
const miners = require('../nodes/miners')

/**
 * Set miner location on the miner map.
 */
exports.set = route.post('/miners', async ctx => {
  const txBody = ctx.request.body
  ctx.assert(Number.isInteger(txBody.lat), 400, '"lat" field is required.')
  ctx.assert(Number.isInteger(txBody.lon), 400, '"long" field is required.')

  miners.addMiner(ctx.state.user.uid, txBody.lat, txBody.lon)

  ctx.body = {miners: miners.miners}
  ctx.status = 201
})
