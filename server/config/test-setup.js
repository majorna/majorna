const supertest = require('supertest')
const db = require('../data/db')
const firebaseConfig = require('./firebase')
const auth = firebaseConfig.auth

let initialized = false

/**
 * Integration test initializer.
 */
exports.init = async () => {
  if (initialized) {
    return
  } else {
    initialized = true
  }

  // initialize firebase auth with users
  // todo: any of these two lines hangs the tests
  // await auth.deleteUser('1')
  // await auth.createUser({
  //   uid: '1',
  //   email: 'chuck@mj.mj',
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

  // prepare supertest
  supertest.agent().set('Authorization', `Bearer ${idToken}`)
  exports.request = supertest()
}
