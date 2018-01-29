const assert = require('assert')
const getRequest = require('../config/test').getReqeust

test('init', async () => {
  assert(getRequest)
  // await getRequest().get('/users/init').expect(500)
})
