const assert = require('assert')
const supertest = require('supertest')
const db = require('../data/db')
const server = require('./server')
const config = require('./config')
const firebaseConfig = require('./firebase') // firebase admin sdk config
const firebaseClientSdk = require('firebase') // firebase client sdk, to impersonate user logins

let koaApp, request, idToken

// module exports
exports.getRequest = () => request
exports.getIdToken = () => idToken

/**
 * Global test setup and teardown.
 * These two run only run once before the test suite starts and after everything is finished.
 */
suiteSetup(async () => {
  // initialize firebase auth with users
  await firebaseConfig.auth.deleteUser('1')
  await firebaseConfig.auth.createUser({
    uid: '1',
    email: 'chuck.norris@majorna.mj',
    emailVerified: true,
    password: 'password',
    displayName: 'Chuck Norris',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false
  })

  // initialize firebase client sdk and sign in as a user, to get an id token
  firebaseClientSdk.initializeApp(require(config.firebase.testClientSdkKeyJsonPath))
  const user1 = await firebaseClientSdk.auth().signInWithEmailAndPassword('chuck.norris@majorna.mj', 'password')
  idToken = await user1.getIdToken()

  // initialize db for integration testing
  await db.testSeed()

  // start server
  koaApp = await server()

  // prepare supertest
  request = supertest.agent(`http://localhost:${config.app.port}`).set('Authorization', `Bearer ${idToken}`)
})

suiteTeardown(async () => {
  await firebaseClientSdk.app().delete()
  await firebaseConfig.app.delete()
  koaApp.close()
})

test('suiteSetup initializes everything', () => {
  assert(request)
  assert(idToken)
})
