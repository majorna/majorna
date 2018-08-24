import { getHashDifficulty } from './Block'
import { getCryptoRandStr, convertBufferToHexStr, getBlockHashPalette } from './crypto'
import { testRunnerStatus } from './test-runner'

let interval
export const stopMining = () => {
  interval && clearInterval(interval)
  interval = null
}

export const isMining = () => interval

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
  const blockHashPalette = new Uint8Array(getBlockHashPalette())
  let nonceBuffer, hashBuffer, hashArray, hexString, difficulty

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

  // wait for test runner if tests are running
  await testRunnerStatus()
  const headerStrBuffer = textEncoder.encode(nonceSuffix + headerStr)

  console.log(`starting hash loop with interval ID: ${localInterval}, target difficulty: ${targetDifficulty}, nonce suffix: ${nonceSuffix}`)
  while (localInterval === interval) {
    nonce++
    nonceBuffer = textEncoder.encode(nonce.toString())
    blockHashPalette.set(nonceBuffer)
    if (nonceBuffer.length !== prevNonceLen) {
      prevNonceLen = nonceBuffer.length
      blockHashPalette.set(headerStrBuffer, nonceBuffer.length)
    }
    hashBuffer = await crypto.subtle.digest(alg, blockHashPalette.buffer)
    hashArray = new Uint8Array(hashBuffer)
    difficulty = getHashDifficulty(hashArray)

    if (difficulty >= targetDifficulty && localInterval === interval) {
      hexString = convertBufferToHexStr(hashArray)
      console.log(`mined block with difficulty: ${difficulty} (target: ${targetDifficulty}), time: ${elapsedTime}s, nonce: ${nonce} (suffix: ${nonceSuffix}), proof-of-work: ${hexString}`)
      stopMining()
      await minedBlockCb(nonce + nonceSuffix)
      break
    }
  }

  console.log(`stopped or finished mining a block with local interval ID: ${localInterval}, next (if any) interval ID: ${interval}`)
}