const assert = require('assert')
const crypto = require('crypto')
const config = require('../config/config')

const algo = 'SHA256'
const encoding = 'base64' // todo: can use DER encoding for signature and save ~20bytes: https://stackoverflow.com/a/39651457/628273

exports.sign = text => {
  return crypto.createSign(algo).update(text).sign(config.crypto.privateKey, encoding)
}

exports.verify = (text, signature) => {
  return crypto.createVerify(algo).update(text).verify(config.crypto.publicKey, signature, encoding)
}

/**
 * Input (Object): {some: ..., other: ...}
 * Output (String): {"sig": ..., "data": ...}
 */
exports.signAndSerialize = txObj => {
  const str = JSON.stringify(txObj)
  const sig = exports.sign(str)
  assert(exports.verify(str, sig))
  return `{"sig":"${sig}","data":${str}}`
}
