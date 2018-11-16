const route = require('koa-route')

/**
 * Get majorna stats from cache/memory to save database cycles.
 */
exports.get = route.get('/stats', async ctx => {
  ctx.body = { daily: {} }
})
