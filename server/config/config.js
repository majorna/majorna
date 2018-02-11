const firebaseAdmin = require('firebase-admin')

const env = process.env.NODE_ENV || (process.env.CI && 'test') || 'development'

// app config
const app = {
  env,

  isProd: env === 'production',
  isDev: env === 'development',
  isTest: env === 'test',
  isCloudFn: false, // if "require('firebase-functions').config().firebase" is defined

  port: process.env.PORT || (env !== 'test' ? 3001 : 3002)
}

// firebase config
const fb = {
  serverKeyJson: process.env.MAJORNA_FIREBASE_JSON,
  serviceKeyJsonPath: process.env.MAJORNA_FIREBASE_JSON_PATH,

  testServiceKeyJsonPath: process.env.MAJORNA_FIREBASE_TEST_JSON_PATH, // test (admin sdk) only
  testClientSdkKeyJsonPath: process.env.MAJORNA_FIREBASE_CLIENT_TEST_JSON_PATH, // test (client sdk) only

  credentials: null,
  config: {
    credential: null
  }
}

if (app.isTest || app.isDev) { // test config with config file
  console.log('config: firebase: dev/test mode')
  const serviceJson = require(fb.testServiceKeyJsonPath)
  fb.credentials = firebaseAdmin.credential.cert(serviceJson)
  fb.config = {credential: fb.credentials}
} else if (app.isCloudFn) { // Google Cloud Functions
  console.log('config: firebase: cloud functions mode')
  fb.config = require('firebase-functions').config().firebase
} else if (fb.serviceKeyJsonPath || fb.serverKeyJson) { // local or manual configuration
  console.log('config: firebase: local/manual mode')
  const serviceJson = (fb.serviceKeyJsonPath && require(fb.serviceKeyJsonPath)) || JSON.parse(fb.serverKeyJson)
  fb.credentials = firebaseAdmin.credential.cert(serviceJson)
  fb.config = {credential: fb.credentials}
} else { // Google Compute Engine
  console.log('config: firebase: gce mode')
  // required GCE access scopes for default credentials to work: https://firebase.google.com/docs/admin/setup
  fb.credentials = firebaseAdmin.credential.applicationDefault()
  fb.config = {credential: fb.credentials}
}

// github
const github = {
  token: process.env.MAJORNA_GITHUB_TOKEN,
  owner: 'majorna',
  repo: app.isProd ? 'blockchain' : 'test-blockchain'
}

// module exports
module.exports = {
  app,
  firebase: fb,
  github
}
