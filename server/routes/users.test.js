const testSetup = require('../config/test-setup')

test('init', async () => {
  await testSetup.request.get().expect(200)
})
