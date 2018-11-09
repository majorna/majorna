const route = require('koa-route')
const peers = require('../peernet/peers')

/**
 * Join peers list and set location on the peer map.
 */
exports.joinPeers = route.post('/peers', async ctx => {
  const txBody = ctx.request.body
  ctx.assert(Number.isInteger(txBody.lat) || (txBody.lat && parseFloat(txBody.lat)), 400, '"lat" field is required and must be an int or float.')
  ctx.assert(Number.isInteger(txBody.lon) || (txBody.lon && parseFloat(txBody.lon)), 400, '"long" field is required and must be an int or float.')

  ctx.body = { peers: peers.addPeer(ctx.state.user.uid, parseFloat(txBody.lat), parseFloat(txBody.lon)) }
  ctx.status = 201
})

/**
 * Retrieves a suitable peer to initiate a WebRTC connection to.
 */
exports.getPeer = route.get('/peers', async ctx => {
  ctx.body = await peers.getPeer(ctx.state.user.uid)
})

/**
 * Posts given signal data to target user by ID.
 */
exports.signal = route.post('/peers/:id/signal', async (ctx, id) => {
  const txBody = ctx.request.body
  ctx.assert(typeof txBody.signalData === 'object', 400, '"signalData" field is required and must be an object.')

  await peers.signal(ctx.state.user.uid, id, txBody.signalData)
  ctx.status = 201
})
