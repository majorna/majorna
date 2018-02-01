const assert = require('assert')
const testData = require('./test').data
const firebaseConfig = require('./firebase')

suite('firebase-config', () => {
  test('firestore access rules', () => {
    // todo: people can only read their user doc and cannot write to it.
    // todo: people can't read others' transactions, or write to it.
  })

  test('verifyIdToken', async () => {
    const decodedToken = await firebaseConfig.verifyIdToken(testData.users.u1Token)
    assert(decodedToken.uid)
    // todo: verify user data
  })
})
