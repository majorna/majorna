const assert = require('assert')
const request = require('../config/test').request

test('init', async () => {
  assert(request)
  // await request().get('/users/init').expect(500)
})
