const crypto = require('crypto')
const config = require('../config')

const sign = crypto.createSign('SHA256')
const verify = crypto.createVerify('SHA256')

exports.sign = data => {
  sign.update(data)
  return sign.sign(config.crypto.privateKey, 'hex') // 'latin1', 'hex' or 'base64'
}

exports.verify = (data, signature) => {
  verify.update(data)
  return verify.verify(config.crypto.publicKey, signature)
}
