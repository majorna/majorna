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

/* StackDriver Logging Filter:

-"--> POST /blocks 201" AND
-"<-- POST /blocks" AND
-"--> OPTIONS /blocks 204" AND
-"<-- OPTIONS /blocks" AND

-"--> POST /peers 201" AND
-"<-- POST /peers" AND
-"OPTIONS /peers 204" AND
-"<-- OPTIONS /peers" AND
-"--> DELETE /peers 200" AND
-"<-- DELETE /peers" AND

-"xxx POST /blocks 400" AND
-"xxx POST /blocks 500" AND

-"Error: 10 ABORTED: Too much contention on these documents." AND
-"skipping mj meta stats update." AND
-"not enough time elapsed since the last block so skipping block creation" AND
-"inserted new block: no" AND

-"server listening on port" AND
-"The behavior for Date objects stored in Firestore is going to change"

https://console.cloud.google.com/logs/viewer?project=majorna-fire&minLogLevel=0&expandAll=false&customFacets&limitCustomFacetWidth=true&interval=NO_LIMIT&resource=global&scrollTimestamp=2018-12-07T16%3A50%3A56.622999906Z&advancedFilter=-%22--%3E%20POST%20%2Fblocks%20201%22%20AND%0A-%22%3C--%20POST%20%2Fblocks%22%20AND%0A-%22--%3E%20OPTIONS%20%2Fblocks%20204%22%20AND%0A-%22%3C--%20OPTIONS%20%2Fblocks%22%20AND%0A-%22--%3E%20POST%20%2Fpeers%20201%22%20AND%0A-%22%3C--%20POST%20%2Fpeers%22%20AND%0A-%22OPTIONS%20%2Fpeers%20204%22%20AND%0A-%22%3C--%20OPTIONS%20%2Fpeers%22%20AND%0A-%22--%3E%20DELETE%20%2Fpeers%20200%22%20AND%0A-%22%3C--%20DELETE%20%2Fpeers%22%20AND%0A-%22xxx%20POST%20%2Fblocks%20400%22%20AND%0A-%22xxx%20POST%20%2Fblocks%20500%22%20AND%0A-%22Error%3A%2010%20ABORTED%3A%20Too%20much%20contention%20on%20these%20documents.%22%20AND%0A-%22skipping%20mj%20meta%20stats%20update.%22%20AND%0A-%22not%20enough%20time%20elapsed%20since%20the%20last%20block%20so%20skipping%20block%20creation%22%20AND%0A-%22inserted%20new%20block%3A%20no%22%20AND%0A-%22server%20listening%20on%20port%22%20AND%0A-%22The%20behavior%20for%20Date%20objects%20stored%20in%20Firestore%20is%20going%20to%20change%22&dateRangeUnbound=forwardInTime

*/

const firebaseAdmin = require('firebase-admin')
const { Logging } = require('@google-cloud/logging')
const config = require('./config')

// (testing only)
if (config.app.isTest) {
  exports.clientSdk = require('firebase') // firebase client sdk, to impersonate user logins during testing
  require('firebase/firestore') // side effect: required for the firebase client sdk app to have .firebase() method
  // we need this since we use firebase web sdk (as opposed to admin sdk) to emulate firestore client connections just like web clients would do
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
