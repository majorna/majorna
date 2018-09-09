const route = require('koa-route')

/**
 * Get majorna stats.
 */
exports.get = route.get('/stats', async ctx => {
  ctx.body = { daily: {} }
})
