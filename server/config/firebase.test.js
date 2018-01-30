const assert = require('assert')
const db = require('../data/db')
const firebaseConfig = require('./firebase')

test('verifyIdToken', async () => {
  const decodedToken = await firebaseConfig.verifyIdToken(db.testData.users.id1Token)
  assert(decodedToken.uid)
  // todo: verify user data
})
