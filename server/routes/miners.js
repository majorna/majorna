const route = require('koa-route')
const miners = require('../nodes/miners')

/**
 * Set miner location on the miner map.
 */
exports.set = route.post('/peers/miners', async ctx => {
  const txBody = ctx.request.body
  ctx.assert(Number.isInteger(txBody.lat) || (txBody.lat && parseFloat(txBody.lat)), 400, '"lat" field is required.')
  ctx.assert(Number.isInteger(txBody.lon) || (txBody.lon && parseFloat(txBody.lon)), 400, '"long" field is required.')

  miners.addMiner(ctx.state.user.uid, parseFloat(txBody.lat), parseFloat(txBody.lon))

  ctx.body = { miners: miners.miners.map(m => ({ lat: m.lat, lon: m.lon })) }
  ctx.status = 201
})
