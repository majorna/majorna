const assert = require('assert')
const crypto = require('crypto')
const config = require('../config/config')

const algo = 'SHA256'
const encoding = 'base64' // todo: can use DER encoding for signature and save ~20bytes: https://stackoverflow.com/a/39651457/628273 (or compressed ec sig for further reduction)

// todo: remove object variants for hash

exports.hashText = text => crypto.createHash(algo).update(text).digest(encoding)

exports.hashObj = obj => exports.hashText(JSON.stringify(obj))

exports.signObj = obj => exports.signText(JSON.stringify(obj))

exports.signText = text => crypto.createSign(algo).update(text).sign(config.crypto.privateKey, encoding)

exports.verifyObj = (obj, sig) => exports.verifyText(JSON.stringify(obj), sig)

exports.verifyText = (text, sig) => crypto.createVerify(algo).update(text).verify(config.crypto.publicKey, sig, encoding)

/**
 * Wraps a given object into a new object with its signature:
 * Input: {field1: ..., field2: ...}
 * Output: {sig: 'base64_encoded_sig', data: {field1: ..., field2: ...}}
 */
exports.signAndWrapObj = obj => {
  const str = JSON.stringify(obj)
  const sig = exports.signText(str)
  assert(exports.verifyText(str, sig))
  return {sig, data: obj}
}
