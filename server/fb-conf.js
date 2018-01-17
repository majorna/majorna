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

const decodedTokenTemplate = {
  iss: 'https://securetoken.google.com/majorna-fire',
  name: 'Chuck Norris',
  picture: 'https://lh3.googleusercontent.com/abc/def/photo.jpg',
  aud: 'majorna-fire',
  auth_time: 1516094974,
  user_id: 'dsafasdgasfgsadsdafdsfa',
  sub: '234sdfsgasdfsadf',
  iat: 1516191924,
  exp: 1516195524,
  email: 'chuck.norris@gmail.com',
  email_verified: true,
  firebase: {
    identities: {
      'google.com': ['1232343453464654'],
      email: ['chuck.norris@gmail.com']
    },
    sign_in_provider: 'google.com'
  },
  uid: 'dsafasdgasfgsadsdafdsfa'
}

exports.verifyTokenMiddleware = async function () {
  // token is in: headers = {Authorization: 'Bearer ' + token}
  const token = ''
  const decodedToken = await auth.verifyIdToken(token) // catch error and respond with 401
  const uid = decodedToken.uid
}