const admin = require('firebase-admin')

const creds = process.env.NODE_ENV === 'production'
  ? admin.credential.applicationDefault()
  : admin.credential.cert(require(process.env.FIREBASE_JSON_PATH))

admin.initializeApp({
  credential: creds,
  databaseURL: 'https://majorna-fire.firebaseio.com'
});
