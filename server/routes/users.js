const route = require('koa-route')
const db = require('../data/db')

exports.init = route.get('/api/users', ctx => db.createUserDoc(ctx.state.user))