const route = require('koa-route')

/**
 * Ping-pong.
 */
exports.init = route.get('/ping', async ctx => {
  ctx.body = 'pong'
})
