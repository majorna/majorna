const admin = require('firebase-admin')

const env = process.env.NODE_ENV
const isProd = env === 'production'
const isCloudFn = false

const creds = isProd
  ? admin.credential.applicationDefault() // required GCE access scopes: https://firebase.google.com/docs/admin/setup
  : admin.credential.cert(require(process.env.FIREBASE_JSON_PATH))

if (!isCloudFn) {
  admin.initializeApp({credential: creds, databaseURL: 'https://majorna-fire.firebaseio.com'})
} else {
  const functions = require('firebase-functions')
  admin.initializeApp(functions.config().firebase)
}

const auth = admin.auth()

async function verifyTokenMiddleware () {
  // token is in: headers = {Authorization: 'Bearer ' + token}
  const token = ''
  const decodedToken = await auth.verifyIdToken(token) // catch error and respond with 401
  const uid = decodedToken.uid
}