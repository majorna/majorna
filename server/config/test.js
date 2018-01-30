const assert = require('assert')
const supertest = require('supertest')
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
  const u1 = db.testData.users.u1Auth
  await firebaseConfig.auth.deleteUser('1')
  await firebaseConfig.auth.createUser(u1)

  // initialize firebase client sdk and sign in as a user, to get an id token
  firebaseClientSdk.initializeApp(require(config.firebase.testClientSdkKeyJsonPath))
  const user1 = await firebaseClientSdk.auth().signInWithEmailAndPassword(u1.email, u1.password)
  db.testData.users.u1Token = await user1.getIdToken()

  // prepare supertest with signed-in user's ID token in authorization header
  db.testData.users.u1Request = supertest.agent(`http://localhost:${config.app.port}`).set('Authorization', `Bearer ${db.testData.users.u1Token}`)

  // initialize db for integration testing
  await db.testSeed()

  // start server
  koaApp = await server()
})

suiteTeardown(async () => {
  await firebaseClientSdk.app().delete()
  await firebaseConfig.app.delete()
  koaApp.close()
})

test('suiteSetup initializes everything', () => {
  assert(db.testData.users.u1Request)
  // todo: assert that u1 request has proper auth header set with id token
  assert(db.testData.users.u1Token)
})
