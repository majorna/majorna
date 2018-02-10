const route = require('koa-route')
const grpc = require('grpc')
const db = require('../data/db')

/**
 * Create user doc and return a blank response (204).
 */
exports.init = route.get('/users/init', async ctx => {
  try {
    await db.createUserDoc(ctx.state.user)
  } catch (e) {
    if (parseInt(e.code) === grpc.status.ALREADY_EXISTS) {
      ctx.status = 200
      return
    } else {
      throw e
    }
  }
  ctx.status = 204
})

exports.get = route.get('/users/:id', async (ctx, id) => {
  const user = await db.getUser(id)
  ctx.body = {
    name: user.name
  }
})
