import { getCryptoRandStr } from '../data/utils'
import { getHashDifficulty } from './Block'

export const receiveTxs = () => {
  // no duplicates
  // no balance below 0
  // valid signatures
}

export const receiveBlock = () => {
  // validate each tx signature unless block is signed by a trusted key
}

export const initPeerConns = () => {
}

let interval
export const stopMining = () => {
  interval && clearInterval(interval)
  interval = null
}

/**
 * Returned promise is not resolved until a block is found.
 * Awaiting this function will block until a block is found or {stopMining} is called.
 */
export const mineBlock = async (headerStr, targetDifficulty, progressCb, minedBlockCb) => {
  const alg = 'SHA-256'
  const nonceSuffix = getCryptoRandStr()
  const start = new Date().getTime()
  let elapsedTime = 0
  let nonce = 0
  let lastNonce = 0
  let prevNonceLen = 0
  const textEncoder = new TextEncoder()
  const fullStrArr = new Uint8Array(2 * 1024 * 1024)
  const headerStrBuffer = textEncoder.encode(nonceSuffix + headerStr)
  let nonceBuffer, hashBuffer, hashArray, base64String, difficulty

  const intervalTime = 1000 //ms
  const localInterval = interval = setInterval(() => {
    elapsedTime = Math.round(new Date(new Date().getTime() - start).getTime() / intervalTime)
    progressCb({
      nonce: nonce,
      time: elapsedTime,
      hashRate: nonce - lastNonce
    })
    lastNonce = nonce
  }, intervalTime)

  console.log(`starting hash loop with interval ID: ${localInterval}, target difficulty: ${targetDifficulty}, nonce suffix: ${nonceSuffix}`)
  while (localInterval === interval) {
    nonce++
    nonceBuffer = textEncoder.encode(nonce.toString())
    fullStrArr.set(nonceBuffer)
    if (nonceBuffer.length > prevNonceLen) {
      prevNonceLen = nonceBuffer.length
      fullStrArr.set(headerStrBuffer, nonceBuffer.length)
    }
    hashBuffer = await crypto.subtle.digest(alg, fullStrArr.buffer)
    hashArray = new Uint8Array(hashBuffer)
    difficulty = getHashDifficulty(hashArray)

    if (difficulty >= targetDifficulty && localInterval === interval) {
      base64String = btoa(String.fromCharCode(...hashArray))
      console.log(`mined block with difficulty: ${difficulty} (target: ${targetDifficulty}), time: ${elapsedTime}s, nonce: ${nonce} (suffix: ${nonceSuffix}), hash: ${base64String}`)
      stopMining()
      await minedBlockCb(nonce + nonceSuffix)
      break
    }
  }

  console.log(`stopped or finished mining a block with local interval ID: ${localInterval}, next (if any) interval ID: ${interval}`)
}