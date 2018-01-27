/**
 * Firebase:
 * - API ref: https://firebase.google.com/docs/reference/admin/node/
 *
 * Firestore:
 * - Src: https://github.com/googleapis/nodejs-firestore
 * - API ref: https://cloud.google.com/nodejs/docs/reference/firestore/latest/
 */
const firebaseAdmin = require('firebase-admin')
const config = require('./config')

const app = exports.app = firebaseAdmin.initializeApp(config.firebase.config)

exports.auth = app.auth()
exports.firestore = app.firestore()

exports.verifyToken = async function () {
  // const token = ''
  // const decodedToken = await exports.auth.verifyIdToken(token) // catch error and respond with 401
  // const uid = decodedToken.uid
}

/**
 * Firebase auth token (JWT) content when decoded.
 */
exports.decodedTokenTemplate = {
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
