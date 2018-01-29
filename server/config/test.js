const supertest = require('supertest')
const db = require('../data/db')
const server = require('./server')
const config = require('./config')
const firebaseConfig = require('./firebase')
const auth = firebaseConfig.auth

let request, koaApp

exports.request = () => request

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

  const idToken = await auth.createCustomToken('1')

  // const user2 = await require('firebase').auth().signInWithEmailAndPassword('chuck@mj.mj', 'password')
  // console.log(await user2.getIdToken())

  // initialize db for integration testing
  await db.seed()

  // start server
  koaApp = await server()

  // prepare supertest
  request = supertest.agent(`http://localhost:${config.app.port}`).set('Authorization', `Bearer ${idToken}`)
})

suiteTeardown(() => koaApp.close())
