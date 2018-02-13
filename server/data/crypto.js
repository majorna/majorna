const crypto = require('crypto')
const config = require('../config/config')

const algo = 'SHA256'
const encoding = 'base64'

exports.sign = data => {
  return crypto.createSign(algo).update(data).sign(config.crypto.privateKey, encoding)
}

exports.verify = (data, signature) => {
  return crypto.createVerify(algo).update(data).verify(config.crypto.publicKey, signature, encoding)
}
