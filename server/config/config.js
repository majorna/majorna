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
  testClientSdkKeyJsonPath: { // test (client sdk) only (same as in App.js)
    apiKey: 'AIzaSyBFZEhjyZdbZEMpboYZzRRHfIUhvo4VaHQ',
    authDomain: 'majorna-test.firebaseapp.com',
    databaseURL: 'https://majorna-test.firebaseio.com',
    projectId: 'majorna-test',
    storageBucket: 'majorna-test.appspot.com',
    messagingSenderId: '346214163117'
  },

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

// crypto
const crypto = {
  publicKey: process.env.MAJORNA_TX_SIGN_PUBLIC_KEY,
  privateKey: process.env.MAJORNA_TX_SIGN_PRIVATE_KEY
}

if (!app.isProd) { // test and development only
  crypto.publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3de5VOcoy/0AD/RxnKxU
80tY81YI0UXJX/VcUITYDDOluSPRA3hgSi2p8CriLLnWWLZGHF3+fhKKzFI8oluL
KrVgKO7rEdpC8w9F4lvbcV0dEbLJj1sk2KsGsSg0ZhfwjNENxkFdMixR1ytqV/5C
0k1qE+/1XCdxw0AT8zm6Od8Odz19rINQENRSW3Lj3as7b/gHBE5XHzaEWy75eeTc
V47jECWtu2ljWg0Sth5AWt9K8kiA4hylJaLnHTwLzJ9/cx0NuWKaDmN3lM/xI4Qn
U8GDD8P521Gf1pC8vtf4FKg4ppiCO9QGAml7ZekZRMDS5B3aYOUcNVPdavoifTav
wwIDAQAB
-----END PUBLIC KEY-----`
  crypto.privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA3de5VOcoy/0AD/RxnKxU80tY81YI0UXJX/VcUITYDDOluSPR
A3hgSi2p8CriLLnWWLZGHF3+fhKKzFI8oluLKrVgKO7rEdpC8w9F4lvbcV0dEbLJ
j1sk2KsGsSg0ZhfwjNENxkFdMixR1ytqV/5C0k1qE+/1XCdxw0AT8zm6Od8Odz19
rINQENRSW3Lj3as7b/gHBE5XHzaEWy75eeTcV47jECWtu2ljWg0Sth5AWt9K8kiA
4hylJaLnHTwLzJ9/cx0NuWKaDmN3lM/xI4QnU8GDD8P521Gf1pC8vtf4FKg4ppiC
O9QGAml7ZekZRMDS5B3aYOUcNVPdavoifTavwwIDAQABAoIBAFgPjQsN45zt5jtv
HjZCFkqpizq02TUxTZmgzS9NPHHDgrJ2bD7DZv2rGL00WKnGbzaxzCzwhthGxgAL
WPReAGVIsE4vYPKqQE85rdUH/5kFjEd9QBN+66ZyZWqnef1Y3W0Ygy5CvhrviuEt
473gOWg/wK7/Xtdg9QC7i+/N54WWryUQ+ZheoCIeJhFvxC3xyvNTKXQVjf1xHQeC
MjJtWbb93w2X6bS/r+EUT5IOvtNJ6KUS1f6gDlU0R/AwhtQpGmfAOVspJ77PFHku
wuhpbtK6kKmM+F5JezPWtWuy7ioGLfTWwVy2i4OucLwrhLnhxyKfXGzfRkd8pyjL
q7036EkCgYEA/HYCtg2WoAtbGS8o5fB2eNKEeNZARTy0DTW0Xlpf02JPSiEbgwFK
gozEOIhmdIznIets+whvfV1Mb6wSM/FD8ubVj/BXud9l9TRHFR1nfhsP0p1W2MyM
7m1laR8s1bVCjalDQPSfu80w3KfCbOA+lSv8iB9P+F1xzISdrlK0uTcCgYEA4PPV
5gZEXwHb+wPJicC1LfGnvdrGYZo//4oEUQSo3N6KagKBJ64IW2COJv/jQzzz8HlH
ILcWLGKma0ZLM8UeahaKpsvwvYaXh5cHYy5dscVwSRxqD0iDg8R9X74/zjejYzkJ
vLjpcON6Dh8CJYZickNyXfRHXAFXd2TSofRyk9UCgYEA+E/qYr4CxO/mbmLgSym0
nSoSeffhxzfpsIR+H7+sOPGdI0BlGvmOG9HwvdoLS9+7BrXUvySQ5DF8GOqaDNTl
DGjW7XhsELoWQpNkxvPg8zwS2AlBfoPSqkCXWkn7g0eBamxtZdo1sjYkNSQcK5J0
e6yD+i8yLQtb/tkBbpCSiQkCgYEA0cm0/rtzgeMbA2LJzqUgksNee0mPXzDaZHeT
hPdCgBEupqTFTHsaIhXPHIHhsTAkE20XL2Rv0l8B8uNweMxpi+iPz/Q8BJSDtpjb
89wm1wZZrGVKaAxpUjap8eNcX/Y1cvCbqxwL4RLUHl0+xD4qi4NpIkQRVLWPm7I0
WYO+Yy0CgYEA4KQPKLemFelADAYlVQPVrJpIcRkgdL9UCYUsaWdfZSDDaxC2ZoXf
5oUKArwITyIHnjygqUJxuOoxBIwz8wjGqGmwmC6KxwpKPv8uvluGC1FTxQqBki2C
E67fEVqJUUX5FYzEKudWR1rksENUHzDhYK5tWLCawyOheUwp0/VtqIE=
-----END RSA PRIVATE KEY-----`
}

// module exports
module.exports = {
  app,
  firebase: fb,
  github,
  crypto
}
