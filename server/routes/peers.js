const route = require('koa-route')
const peers = require('../data/peers')

/**
 * Join miners list and set location on the miner map.
 */
exports.joinMiners = route.post('/peers/miners', async ctx => {
  const txBody = ctx.request.body
  ctx.assert(Number.isInteger(txBody.lat) || (txBody.lat && parseFloat(txBody.lat)), 400, '"lat" field is required and must be an int or float.')
  ctx.assert(Number.isInteger(txBody.lon) || (txBody.lon && parseFloat(txBody.lon)), 400, '"long" field is required and must be an int or float.')

  ctx.body = { miners: peers.addMiner(ctx.state.user.uid, parseFloat(txBody.lat), parseFloat(txBody.lon)) }
  ctx.status = 201
})

/**
 * Initiates a connection to a suitable peer with the provided signal data.
 */
exports.initPeer = route.post('/peers/initPeer', async ctx => {
  const txBody = ctx.request.body
  ctx.assert(typeof txBody.localConnId === 'string', 400, '"localConnId" field is required and must be a string.')
  ctx.assert(typeof txBody.signalData === 'string', 400, '"signalData" field is required and must be a string.')
})

/**
 * Posts given signal data to target user by ID.
 */
exports.signal = route.post('/peers/signal', async ctx => {
  const txBody = ctx.request.body
  ctx.assert(typeof txBody.userId === 'string', 400, '"userId" field is required and must be a string.')
  ctx.assert(typeof txBody.signalData === 'string', 400, '"signalData" field is required and must be a string.')
})
