import config from '../data/config'
const textEncoder = new TextEncoder('utf-8')

/**
 * Signs given text, asynchronously.
 * Returned promise resolves to the signature.
 */
export function signText(text) {
  return crypto.subtle.sign(config.crypto.algo, config.crypto.privateKey, textEncoder.encode(text))
}

/**
 * Verifies given text with signature, asynchronously.
 * Returned promise resolves to a boolean.
 */
export function verifyText(sig, text) {
  return crypto.subtle.verify(config.crypto.algo, config.crypto.publicKey, sig, text)
}
