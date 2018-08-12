const fs = require('fs')
const firebaseAdmin = require('firebase-admin')

const env = process.env.NODE_ENV || (process.env.CI && 'test') || 'development'
console.log(`config: ${env}`)

const domain = 'getmajorna.com'

// throw if required env vars are not defined
if (!process.env.MAJORNA_FIREBASE_JSON && !process.env.MAJORNA_FIREBASE_JSON_PATH) {
  throw new Error('required environment variables are not defined')
}

// app config
const app = {
  env,

  isProd: env === 'production',
  isDev: env === 'development',
  isTest: env === 'test',
  isCloudFn: false, // if "require('firebase-functions').config().firebase" is defined

  port: process.env.PORT || (env !== 'test' ? 3001 : 3002),

  debugMode: false, // enables debug logging

  domain,
  url: `https://${domain}`,
  logoUrl: 'https://raw.githubusercontent.com/majorna/majorna/master/src/res/mj.png'
}

// firebase config
const fb = {
  serverKeyJson: process.env.MAJORNA_FIREBASE_JSON,
  serviceKeyJsonPath: process.env.MAJORNA_FIREBASE_JSON_PATH,

  testServiceKeyJsonPath: process.env.MAJORNA_FIREBASE_TEST_JSON_PATH, // test (admin sdk) only
  testClientSdkKeyJsonPath: { // test (client sdk) only (same as in App.js)
    apiKey: 'AIzaSyBFZEhjyZdbZEMpboYZzRRHfIUhvo4VaHQ',
    authDomain: 'majorna-test.firebaseapp.com',
    databaseURL: 'https://majorna-test.firebaseio.com',
    projectId: 'majorna-test',
    storageBucket: 'majorna-test.appspot.com',
    messagingSenderId: '346214163117'
  },

  serviceJson: null,
  credentials: null,
  config: {
    credential: null
  }
}

if (app.isTest || app.isDev) { // test config with config file
  console.log('config: firebase: dev/test mode')
  fb.serviceJson = require(fb.testServiceKeyJsonPath)
  fb.credentials = firebaseAdmin.credential.cert(fb.serviceJson)
  fb.config = {credential: fb.credentials}
} else if (app.isCloudFn) { // Google Cloud Functions
  console.log('config: firebase: cloud functions mode')
  fb.config = require('firebase-functions').config().firebase
} else if (fb.serviceKeyJsonPath || fb.serverKeyJson) { // local or manual configuration
  console.log('config: firebase: local/manual mode')
  fb.serviceJson = (fb.serviceKeyJsonPath && require(fb.serviceKeyJsonPath)) || JSON.parse(fb.serverKeyJson)
  fb.credentials = firebaseAdmin.credential.cert(fb.serviceJson)
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

// crypto
const crypto = {
  privateKey: process.env.MAJORNA_TX_SIGN_PRIVATE_KEY,
  privateKeyPath: process.env.MAJORNA_TX_SIGN_PRIVATE_KEY_PATH,
  publicKey: process.env.MAJORNA_TX_SIGN_PUBLIC_KEY,
  publicKeyPath: process.env.MAJORNA_TX_SIGN_PUBLIC_KEY_PATH
}

if (app.isProd) {
  if (!crypto.privateKey) {
    crypto.privateKey = fs.readFileSync(crypto.privateKeyPath)
    crypto.publicKey = fs.readFileSync(crypto.publicKeyPath)
  }
} else {
  // only for testing and dev
  crypto.privateKey = `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIHZ9HWFXtortTsbEOOjPZ6hIMDTiFVWX552YWW5aZHlgoAcGBSuBBAAK
oUQDQgAE2yLEGhHZMiClLt4rHm6Kajo2qsRRQMUW3PqHOBnECvFkwXZstFNGyZD4
SVbeNVCQy7nXERlaQ7Kvt4dgZTp1UA==
-----END EC PRIVATE KEY-----`
  crypto.publicKey = `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE2yLEGhHZMiClLt4rHm6Kajo2qsRRQMUW
3PqHOBnECvFkwXZstFNGyZD4SVbeNVCQy7nXERlaQ7Kvt4dgZTp1UA==
-----END PUBLIC KEY-----`
}

// blockchain
const blockchain = {
  blockInterval: (app.isProd ? 10 : 3) * 60 * 1000, // ms

  initialMinBlockDifficulty: app.isProd ? 10 : 1,
  blockDifficultyIncrementStep: 1,
  difficultyRewardMultiplier: app.isProd ? 0.05 : 1 // (reward multiplier < 1 breaks tests due to math.round)
}

// 3rd party integrations
const integrations = {
  coinbaseCommerce: {
    apiKey: process.env.MAJORNA_COINBASE_COMMERCE_API_KEY,
    webhookSharedSecret: process.env.MAJORNA_COINBASE_COMMERCE_WEBHOOK_SHARED_SECRET
  },
  stripe: {
    secretKey: app.isProd ? process.env.MAJORNA_STRIPE_SECRET_KEY : process.env.MAJORNA_STRIPE_TEST_SECRET_KEY
  }
}

// module exports
module.exports = {
  app,
  firebase: fb,
  github,
  crypto,
  blockchain,
  integrations
}
