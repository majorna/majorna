const firebaseAdmin = require('firebase-admin')

const env = process.env.NODE_ENV || 'development'

const app = exports.app = {
  env,
  isProd: env === 'production',
  isDev: env === 'development',
  isTest: env === 'test',
  isCloudFn: false // if "require('firebase-functions').config().firebase" is defined
}

const fb = exports.firebase = {
  serviceKeyJsonPath: process.env.FIREBASE_TEST_JSON_PATH,
  credentials: null,
  config: {
    credential: null
  }
}

if (app.isCloudFn) { // Google Cloud Functions
  fb.config = require('firebase-functions').config().firebase
} else if (fb.serviceKeyJsonPath) { // local or manual configuration
  const serviceJson = require(fb.serviceKeyJsonPath)
  fb.credentials = firebaseAdmin.credential.cert(serviceJson)
  fb.config = {credential: fb.credentials}
} else { // Google Compute Engine
  // required GCE access scopes for default credentials to work: https://firebase.google.com/docs/admin/setup
  fb.credentials = firebaseAdmin.credential.applicationDefault()
  fb.config = {credential: fb.credentials}
}
