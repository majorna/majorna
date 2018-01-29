const assert = require('assert')
const supertest = require('supertest')
const db = require('../data/db')
const server = require('./server')
const config = require('./config')
const firebaseClient = require('firebase') // firebase client sdk (to get client id token), not the admin sdk
const authClient = firebaseClient.auth()

let koaApp, request, idToken

// module exports
exports.request = () => request
exports.idToken = () => idToken

/**
 * Global test setup and teardown.
 * These two run only run once before the test suite starts and after everything is finished.
 */
suiteSetup(async () => {
  // initialize firebase auth with users
  // todo: any of these two lines hangs the tests
  // await auth.deleteUser('1')
  // await auth.createUser({
  //   uid: '1',
  //   email: 'chuck.norris@majorna.mj',
  //   emailVerified: true,
  //   phoneNumber: '+11234567890',
  //   password: 'password',
  //   displayName: 'Chuck Norris',
  //   photoURL: 'http://www.example.com/12345678/photo.png',
  //   disabled: false
  // })

  // initialize firebase client sdk and sign in as a user, to get an id token
  const user1 = await authClient.signInWithEmailAndPassword('chuck.norris@majorna.mj', 'password')
  idToken = await user1.getIdToken()

  // initialize db for integration testing
  await db.seed()

  // start server
  koaApp = await server()

  // prepare supertest
  request = supertest.agent(`http://localhost:${config.app.port}`).set('Authorization', `Bearer ${idToken}`)
})

suiteTeardown(() => koaApp.close())

test('suiteSetup initializes everything', () => {
  assert(request)
  assert(idToken)
})
