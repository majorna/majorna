import config from '../data/config'
window.TextEncoder = window.TextEncoder || class {}
const textEncoder = new window.TextEncoder('utf-8')

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
  return btoa(String.fromCharCode(...new Uint8Array(sigBuff)))
}

/**
 * Verifies given text with signature, asynchronously.
 * Returned promise resolves to a boolean.
 */
export function verifyText(sig, text) {
  return crypto.subtle.verify(
    {name: config.crypto.signAlgo, hash: config.crypto.hashAlgo},
    config.crypto.publicKey,
    sig instanceof ArrayBuffer ? sig : base64ToArrayBuffer(sig),
    text instanceof ArrayBuffer ? text : textEncoder.encode(text)
  )
}

function base64ToArrayBuffer(base64) {
  const binary_string =  window.atob(base64)
  const len = binary_string.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++)        {
    bytes[i] = binary_string.charCodeAt(i)
  }
  return bytes
}