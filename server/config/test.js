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
  // delete then re-initialize firebase auth with users
  const usersRes = await firebaseConfig.auth.listUsers()
  usersRes.users.forEach(u => firebaseConfig.auth.deleteUser(u.uid))
  const u1 = testData.users.u1Auth
  const u4 = testData.users.u4Auth
  await firebaseConfig.auth.createUser(u1)
  await firebaseConfig.auth.createUser(u4)

  // initialize firebase client sdk and sign in as a user, to get an id token
  testData.users.u1FBClient = firebaseClientSdk.initializeApp(require(config.firebase.testClientSdkKeyJsonPath), 'u1FBClient')
  const authUser1 = await testData.users.u1FBClient.auth().signInWithEmailAndPassword(u1.email, u1.password)
  testData.users.u1Token = await authUser1.getIdToken()
  testData.users.u4FBClient = firebaseClientSdk.initializeApp(require(config.firebase.testClientSdkKeyJsonPath), 'u4FBClient')
  const authUser2 = await testData.users.u4FBClient.auth().signInWithEmailAndPassword(u4.email, u4.password)
  testData.users.u4Token = await authUser2.getIdToken()

  // prepare http request client with signed-in user's ID token in authorization header
  testData.users.anonRequest = axios.create({
    baseURL: `http://localhost:${config.app.port}`,
    validateStatus: false
  })
  testData.users.u1Request = axios.create({
    baseURL: `http://localhost:${config.app.port}`,
    headers: {'Authorization': `Bearer ${testData.users.u1Token}`},
    validateStatus: false
  })
  testData.users.u4Request = axios.create({
    baseURL: `http://localhost:${config.app.port}`,
    headers: {'Authorization': `Bearer ${testData.users.u4Token}`},
    validateStatus: false
  })

  // initialize db for integration testing
  await db.initTest()

  // start server
  koaApp = await server()
})

suiteTeardown(async () => {
  await testData.users.u1FBClient.delete()
  await testData.users.u4FBClient.delete()
  await firebaseConfig.app.delete()
  koaApp.close()
})

suite('test-config', () => {
  test('suiteSetup initializes everything', () => {
    assert(testData.users.u1Request)
    assert(testData.users.u1Request.defaults.headers.Authorization.includes(testData.users.u1Token))
    assert(testData.users.u1Token)
  })
})

const time = new Date()
const testData = exports.data = {
  mj: {
    meta: {val: 0.01, cap: 1000}
  },
  // u1: User #1
  // u1Doc: Firestore doc seed data
  // u1Auth: Firebase Authentication user seed data
  // u1FBClient: Firebase Client instance (with live connection to Firebase servers)
  // u1Token: Firebase Authentication ID token (has limited lifetime)
  // u1Request: Preconfigured HTTP client instance with Firebase Auth token in it for that user
  users: {
    anonRequest: null,
    u1Doc: {
      email: 'chuck.norris@majorna.mj',
      name: 'Chuck Norris',
      created: time,
      balance: 500,
      txs: []
    },
    u1Auth: {
      uid: '1',
      email: 'chuck.norris@majorna.mj',
      emailVerified: true,
      password: 'password',
      displayName: 'Chuck Norris',
      photoURL: 'https://example.com/p86sadfu/photo.png'
    },
    u1FBClient: null,
    u1Token: null,
    u1Request: null,
    u2Doc: {
      email: 'morgan.almighty@majorna.mj',
      name: 'Morgan Almighty',
      created: time,
      balance: 500,
      txs: []
    },
    u3Doc: {
      email: 'john.doe@majorna.mj',
      name: 'John Doe',
      created: time,
      balance: 500,
      txs: []
    },
    u4Auth: {
      uid: '4',
      email: 'bob.marley@majorna.mj',
      emailVerified: true,
      password: 'password',
      displayName: 'Bob Marley',
      photoURL: 'https://example.com/58972q34/photo.png'
    },
    u4FBClient: null,
    u4Token: null,
    u4Request: null
  },
  txs: [],
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
