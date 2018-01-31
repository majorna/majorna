const assert = require('assert')
const testData = require('./test').data
const firebaseConfig = require('./firebase')

test('verifyIdToken', async () => {
  const decodedToken = await firebaseConfig.verifyIdToken(testData.users.u1Token)
  assert(decodedToken.uid)
  // todo: verify user data
})
