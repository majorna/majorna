const firebaseAdmin = require('firebase-admin')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(require(process.env.FIREBASE_JSON_PATH)),
  databaseURL: 'https://majorna-fire.firebaseio.com'
})

test('verifyIdToken', async () => {
  const decodedToken = await firebaseAdmin.auth().verifyIdToken(process.env.FIREBASE_TEST_TOKEN)
})
