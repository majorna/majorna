const crypto = require('crypto')
const config = require('../config/config')

const sign = crypto.createSign('SHA256')
const verify = crypto.createVerify('SHA256')

exports.sign = data => {
  sign.update(data)
  return sign.sign(config.crypto.privateKey)
}

exports.verify = (data, signature) => {
  verify.update(data)
  return verify.verify(config.crypto.publicKey, signature)
}
