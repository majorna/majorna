const assert = require('assert')
const axios = require('axios')
const db = require('../data/db')
const server = require('./server')
const config = require('./config')
const firebaseConfig = require('./firebase') // firebase admin sdk config
const firebaseClientSdk = require('firebase') // firebase client sdk, to impersonate user logins

let koaApp

/**
 * Global test setup and teardown.
 * These two run only run once before the test suite starts and after everything is finished.
 */
suiteSetup(async () => {
  // initialize firebase auth with users
  const u1 = data.users.u1Auth
  await firebaseConfig.auth.deleteUser('1')
  await firebaseConfig.auth.createUser(u1)

  // initialize firebase client sdk and sign in as a user, to get an id token
  firebaseClientSdk.initializeApp(require(config.firebase.testClientSdkKeyJsonPath))
  const user1 = await firebaseClientSdk.auth().signInWithEmailAndPassword(u1.email, u1.password)
  data.users.u1Token = await user1.getIdToken()

  // prepare http request client with signed-in user's ID token in authorization header
  data.users.u1Request = axios.create({
    baseURL: `http://localhost:${config.app.port}`,
    headers: {'Authorization': `Bearer ${data.users.u1Token}`}
  })

  // initialize db for integration testing
  await db.initTest()

  // start server
  koaApp = await server()
})

suiteTeardown(async () => {
  await firebaseClientSdk.app().delete()
  await firebaseConfig.app.delete()
  koaApp.close()
})

test('suiteSetup initializes everything', () => {
  assert(data.users.u1Request)
  assert(data.users.u1Request.defaults.headers.Authorization.includes(data.users.u1Token))
  assert(data.users.u1Token)
})

const time = new Date()
const data = exports.data = {
  mj: {
    meta: {val: 0.01, cap: 500}
  },
  // idx = firestore doc, authx = firebase auth user
  users: {
    u1Doc: {
      email: 'chuck.norris@majorna.mj',
      name: 'Chuck Norris',
      created: time,
      balance: 0,
      txs: []
    },
    u1Auth: {
      uid: '1',
      email: 'chuck.norris@majorna.mj',
      emailVerified: true,
      password: 'password',
      displayName: 'Chuck Norris',
      photoURL: 'http://www.example.com/12345678/photo.png',
      disabled: false
    },
    u1Token: null,
    u1Request: null,
    u2Doc: {
      email: 'morgan.almighty@majorna.mj',
      name: 'Morgan Almighty',
      created: time,
      balance: 0,
      txs: []
    },
    u3Doc: {
      email: 'john.doe@majorna.mj',
      name: 'John Doe',
      created: time,
      balance: 0,
      txs: []
    }
  },
  // Firebase authentication ID token (JWT) content when decoded
  decodedIdTokenSample: {
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
}
