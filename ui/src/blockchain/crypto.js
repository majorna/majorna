import config from '../data/config'
import assert from './assert'

const textEncoder = new TextEncoder()

/**
 * Convert given ArrayBuffer instance to hex encoded string.
 */
export const convertBufferToHexStr = buffer => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')

/**
 * Convert given hex encoded string to ArrayBuffer.
 */
export const convertHexStrToBuffer = hexStr => new Uint8Array(hexStr.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))).buffer

/**
 * Hashes given ArrayBuffer object, asynchronously. Returns hash as ArrayBuffer.
 */
export const hashBufferToBuffer = buffer => crypto.subtle.digest({name: config.crypto.hashAlgo}, buffer)

/**
 * Hashes given string, asynchronously. Returns hash as ArrayBuffer.
 */
export const hashStrToBuffer = str => hashBufferToBuffer(textEncoder.encode(str))

/**
 * Hashes given string, asynchronously. Returns hash as hex encoded string.
 */
export const hashStrToHexStr = async str => convertBufferToHexStr(await hashStrToBuffer(str))

/**
 * Signs given string, asynchronously. Returned promise resolves to the hex encoded signature.
 */
export const signStrToHexStr = async str => convertBufferToHexStr(await crypto.subtle.sign( // todo: use compressed ec sig (50% reduction) + DER encoding for signature and save ~20bytes: https://stackoverflow.com/a/39651457/628273
  {name: config.crypto.signAlgo, hash: config.crypto.hashAlgo},
  config.crypto.privateKey,
  textEncoder.encode(str)
))

/**
 * Verifies given string with hex encoded signature, asynchronously.
 * Throws an AssertionError if signature is invalid.
 */
export const verifyStrWithHexStrSig = async (sig, str, failureDescription) => assert(await crypto.subtle.verify(
  {name: config.crypto.signAlgo, hash: config.crypto.hashAlgo},
  config.crypto.publicKey,
  convertHexStrToBuffer(sig),
  textEncoder.encode(str)
), failureDescription || 'Invalid signature.')

/**
 * Creates and returns a crypto secure random string.
 */
export function getCryptoRandStr() {
  const arr = new Uint16Array(1)
  crypto.getRandomValues(arr)
  return arr[0].toString()
}

let blockHashPalette // lazy init the large palette memory
/**
 * Creates and returns the ArrayBuffer that needs to be used to write hash buffer over to.
 * Uses optimized version of the Park-Miller PRNG: http://www.firstpr.com.au/dsp/rand31/
 */
export function getBlockHashPalette() {
  const bytesPerInt = 4 // int32
  const paletteLen = 2 * 1024 * 1024 / bytesPerInt
  let totalLoop = paletteLen, innerLoop = 64
  if (!blockHashPalette) {
    blockHashPalette = new Uint32Array(paletteLen)
  } else {
    totalLoop = 2 * 1024 / bytesPerInt
  }

  // will start repeating at 2^31 - 1 = 2 * 1024 * 1024 * 1024 - 1 = 2147483647 iterations
  let seed = 20180101 % 2147483647
  for (let i = 0; i < totalLoop; i++) {
    blockHashPalette[i] = 0
    for (let j = 0; j < innerLoop; j++) blockHashPalette[i] += (seed = seed * 16807 % 2147483647)
  }
  return blockHashPalette.buffer
}
