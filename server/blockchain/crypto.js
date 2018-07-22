const crypto = require('crypto')
const config = require('../config/config')

exports.algo = 'SHA256'
// todo: can use DER encoding for signature and save ~20bytes: https://stackoverflow.com/a/39651457/628273 (or compressed ec sig for further reduction)
exports.encoding = 'base64'

exports.hashTextOrBufferToBuffer = text => crypto.createHash(exports.algo).update(text).digest()

exports.hashTextOrBuffer = text => exports.hashTextOrBufferToBuffer(text).toString(exports.encoding)

exports.signTextOrBuffer = text => crypto.createSign(exports.algo).update(text).sign(config.crypto.privateKey, exports.encoding)

exports.verifyTextOrBuffer = (sig, text) => crypto.createVerify(exports.algo).update(text).verify(config.crypto.publicKey, sig, exports.encoding)
