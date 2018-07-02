import config from '../data/config'
window.TextEncoder = window.TextEncoder || class {}
// todo: drop this and always use ArrayBuffer? / at least internally in Tx/Block classes
const textEncoder = new window.TextEncoder(config.crypto.textEncoding)

/**
 * Convert given ArrayBuffer instance to hexadecimal string.
 */
export const bufferToHex = buffer => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')

/**
 * Convert given hexadecimal string to ArrayBuffer.
 */
export const hexToBuffer = hexStr => new Uint8Array(hexStr.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))).buffer

/**
 * Hashes given ArrayBuffer object, asynchronously. Returns hash as ArrayBuffer.
 */
export const hash = buffer => crypto.subtle.digest({name: config.crypto.hashAlgo}, buffer)

/**
 * Hashes given string, asynchronously. Returns hash as ArrayBuffer.
 */
export const hashStr = str => hash(textEncoder.encode(str))

/**
 * Signs given string, asynchronously. Returned promise resolves to the hex encoded signature.
 */
export const signStr = async str => bufferToHex(await crypto.subtle.sign( // todo: use compressed ec sig (50% reduction) + DER encoding for signature and save ~20bytes: https://stackoverflow.com/a/39651457/628273
  {name: config.crypto.signAlgo, hash: config.crypto.hashAlgo},
  config.crypto.privateKey,
  textEncoder.encode(str)
))

/**
 * Verifies given string with signature, asynchronously. Returned promise resolves to a boolean.
 */
export const verifyStr = (sig, str) => crypto.subtle.verify(
  {name: config.crypto.signAlgo, hash: config.crypto.hashAlgo},
  config.crypto.publicKey,
  hexToBuffer(sig),
  textEncoder.encode(str)
)
