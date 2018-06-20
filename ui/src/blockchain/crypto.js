import config from '../data/config'

export function signText(text) {
  return crypto.subtle.sign(config.crypto.algo, config.crypto.privateKey, text)
}

export function verifyText(sig, text) {
  return crypto.subtle.verify(config.crypto.algo, config.crypto.publicKey, sig, text)
}
