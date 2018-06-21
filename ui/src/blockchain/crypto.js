import config from '../data/config'
const textEncoder = new TextEncoder('utf-8')

/**
 * Signs given text, asynchronously.
 * Returned promise resolves to the signature.
 */
export function signText(text) {
  return crypto.subtle.sign(
    {name: config.crypto.signAlgo, hash: config.crypto.hashAlgo},
    config.crypto.privateKey,
    textEncoder.encode(text)
  )
}

/**
 * Verifies given text with signature, asynchronously.
 * Returned promise resolves to a boolean.
 */
export function verifyText(sig, text) {
  return crypto.subtle.verify(
    {name: config.crypto.signAlgo, hash: config.crypto.hashAlgo},
    config.crypto.publicKey,
    sig instanceof ArrayBuffer ? sig : textEncoder.encode(sig),
    text instanceof ArrayBuffer ? text : textEncoder.encode(text)
  )
}
