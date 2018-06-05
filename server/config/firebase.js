/**
 * Firebase Admin SDK:
 * - API ref: https://firebase.google.com/docs/reference/admin/node/
 * - Changelog: https://firebase.google.com/support/release-notes/admin/node
 * - Changelog (firebase client used in tests - not firebase admin!): https://firebase.google.com/support/release-notes/js
 *
 * Firestore:
 * - API ref: https://cloud.google.com/nodejs/docs/reference/firestore/latest/
 * - Src: https://github.com/googleapis/nodejs-firestore
 *
 * gRPC:
 * - Status API Ref: https://grpc.io/grpc/node/grpc.html#.status__anchor
 * - Src: https://github.com/grpc/grpc-node/blob/master/packages/grpc-native-core/src/constants.js
 *
 * Firestore calls gRPC errors in the format {code: grpc.status.ALREADY_EXISTS ('6'), message: ..., details: ...}
 * Error code comparison requires parseInt: parseInt(err.code) === grpc.status.ALREADY_EXISTS
 *
 * StackDriver (logging):
 * - API ref: https://cloud.google.com/nodejs/docs/reference/logging/latest/
 * - Src: https://github.com/googleapis/nodejs-logging
 */
const firebaseAdmin = require('firebase-admin')
const Logging = require('@google-cloud/logging')
const config = require('./config')

// (testing only)
if (config.app.isTest) {
  exports.clientSdk = require('firebase') // firebase client sdk, to impersonate user logins during testing
  require('firebase/firestore') // side effect: required for the firebase client sdk app to have .firebase() method
}

// module exports
exports.app = firebaseAdmin.initializeApp(config.firebase.config)
exports.auth = exports.app.auth()
exports.firestore = exports.app.firestore()
exports.log = new Logging({
  projectId: config.firebase.serviceJson.project_id,
  credentials: {
    client_email: config.firebase.serviceJson.client_email,
    private_key: config.firebase.serviceJson.private_key
  }
}).log('majorna')

/**
 * Verify a given Firebase Authentication ID token and return the decoded user object, asynchronously.
 */
exports.verifyIdToken = token => exports.auth.verifyIdToken(token)
