const route = require('koa-route')
const db = require('../data/db')

/**
 * Create user doc and return a blank response (204).
 */
exports.init = route.get('/users/init', async ctx => {
  await db.createUserDoc(ctx.state.user)
  ctx.status = 204
})

exports.get = route.get('/users/:id', async (ctx, id) => {
  const user = await db.getUser(id)
  ctx.body = {
    name: user.name
  }
})
