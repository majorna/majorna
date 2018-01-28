const request = require('../config/test').request

test('init', async () => {
  await request().get('/users/init').expect(200)
})
