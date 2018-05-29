const config = require('./config')

if (config.app.isNode) {
  const crypto = require('crypto')

  exports.hashTextToBuffer = text => crypto.createHash(config.crypto.algo).update(text).digest()

  exports.hashText = text => exports.hashTextToBuffer(text).toString(config.crypto.encoding)

  exports.signText = text => crypto.createSign(config.crypto.algo).update(text).sign(config.crypto.privateKey, config.crypto.encoding)

  exports.verifyText = (sig, text) => crypto.createVerify(config.crypto.algo).update(text).verify(config.crypto.publicKey, sig, config.crypto.encoding)
} else {

}
