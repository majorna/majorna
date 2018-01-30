const assert = require('assert')
const testConfig = require('./test')
const firebaseConfig = require('./firebase')

test('verifyIdToken', async () => {
  const decodedToken = await firebaseConfig.verifyIdToken(testConfig.getUser1IdToken())
  assert(decodedToken.uid)
  // todo: verify user data
})
