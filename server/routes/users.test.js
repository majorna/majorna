const testSetup = require('../config/test-setup')
let request

beforeAll(async () => { request = await testSetup() })

test('init', async () => {
  await request.get().expect(200)
})
