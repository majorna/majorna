import config from '../data/config'
const textEncoder = new TextEncoder('utf-8')

/**
 * Signs given text, asynchronously.
 * Returned promise resolves to the signature.
 */
export async function signText(text) {
  const sigBuff = await crypto.subtle.sign(
    {name: config.crypto.signAlgo, hash: config.crypto.hashAlgo},
    config.crypto.privateKey,
    textEncoder.encode(text)
  )
  return sigBuff
}

/**
 * Verifies given text with signature, asynchronously.
 * Returned promise resolves to a boolean.
 */
export function verifyText(sig, text) {
  const asig = btoa(String.fromCharCode(...new Uint8Array(sig)))

  return crypto.subtle.verify(
    {name: config.crypto.signAlgo, hash: config.crypto.hashAlgo},
    config.crypto.publicKey,
    sig instanceof ArrayBuffer ? sig : textEncoder.encode(atob(asig)),
    text instanceof ArrayBuffer ? text : textEncoder.encode(text)
  )
}
