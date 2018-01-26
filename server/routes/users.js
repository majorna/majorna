const route = require('koa-route')
const db = require('../data/db')

exports.init = route.get('/users', ctx => db.createUserDoc(ctx.state.user))
