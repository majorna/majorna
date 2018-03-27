const assert = require('assert')
const testData = require('./test').data
const firebaseConfig = require('./firebase')

suite('config: firebase', () => {
  test('verifyIdToken', async () => {
    const u1 = testData.users.u1Auth
    const decodedToken = await firebaseConfig.verifyIdToken(testData.users.u1Token)
    assert(decodedToken.uid === u1.uid)
    assert(decodedToken.email === u1.email)
    assert(decodedToken.name === u1.displayName)
  })
})
