const request = require('../config/test').request

it('init', async () => {
  await request().get('/users').expect(404)
})
