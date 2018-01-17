const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(require(process.env.FIREBASE_JSON_PATH)),
  databaseURL: 'https://majorna-fire.firebaseio.com'
})

test('verifyIdToken', async () => {
  const decodedToken = await admin.auth().verifyIdToken(process.env.FIREBASE_TEST_TOKEN)
})
