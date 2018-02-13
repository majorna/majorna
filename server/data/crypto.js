const crypto = require('crypto')
const config = require('../config/config')

const algo = 'SHA256'
// todo: can use DER encoding for signature and save ~20bytes: https://stackoverflow.com/a/39651457/628273
const encoding = 'base64'

exports.sign = data => {
  return crypto.createSign(algo).update(data).sign(config.crypto.privateKey, encoding)
}

exports.verify = (data, signature) => {
  return crypto.createVerify(algo).update(data).verify(config.crypto.publicKey, signature, encoding)
}
