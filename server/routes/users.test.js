const assert = require('assert')
const getRequest = require('../config/test').getRequest

test('init', async () => {
  assert(getRequest)
  // await getRequest().get('/users/init').expect(500)
})
