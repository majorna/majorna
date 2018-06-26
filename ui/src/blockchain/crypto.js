import config from '../data/config'
window.TextEncoder = window.TextEncoder || class {}
const textEncoder = new window.TextEncoder('utf-8')

export const bufferToHex = buffer => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')

export const hexToBuffer = hex => new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)))

/**
 * Hashes given ArrayBuffer object, asynchronously.
 */
export const hash = buffer => crypto.subtle.digest({name: config.crypto.hashAlgo}, buffer)

/**
 * Hashes given ArrayBuffer object to text, asynchronously.
 */
export const hashToText = async buffer => bufferToBase64(await hash(buffer))

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
  return bufferToBase64(sigBuff)
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

// todo: can use hex instead since fromCharCode is utf-16 on browser and utf-8 in node

const bufferToBase64 = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer)))

function base64ToArrayBuffer(base64) {
  const binary_string =  window.atob(base64)
  const len = binary_string.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++)        {
    bytes[i] = binary_string.charCodeAt(i)
  }
  return bytes
}