export const receiveTxs = () => {
  // no duplicates
  // no balance below 0
  // valid signatures
}

export const receiveBlock = () => {
  // validate each tx signature unless block is signed by a trusted key
}

export const initSimplePeer = () => {}

let interval
export const stopMining = () => {
  interval && clearInterval(interval)
  interval = null
}

/**
 * Accepts a hash as an Uint8Array array, returns the difficulty as an integer.
 * Node.js Buffer implement Uint8Array API so buffer instances are also acceptable.
 *
 * todo: this is copy/paste from svr/block.js so better used a shared lib
 */
function getHashDifficulty(hash) {
  let difficulty = 0

  for (let i = 0; i < hash.length; i++) {
    if (hash[i] === 0) {
      difficulty += 8
      continue
    } else if (hash[i] === 1) {
      difficulty += 7
    } else if (hash[i] < 4) {
      difficulty += 6
    } else if (hash[i] < 8) {
      difficulty += 5
    } else if (hash[i] < 16) {
      difficulty += 4
    } else if (hash[i] < 32) {
      difficulty += 3
    } else if (hash[i] < 64) {
      difficulty += 2
    } else if (hash[i] < 128) {
      difficulty += 1
    }
    break
  }

  return difficulty
}

/**
 * Returned promise is not resolved until a block is found.
 * Awaiting this function will block until a block is found or {stopMining} is called.
 *
 * todo: since data to be hashed is so small, async/await cycle takes a lot longer than actual hashing
 * (note: since it is async, we can massively parallelize this)
 * node-forge is about 10x faster here (but needs breaks in the loop with setImmediate not to block the event loop forever)
 * alternatively we can increase the input text size to make async call overhead negligible / or just sha3 or PoS variant
 */
export const mineBlock = async (headerStr, targetDifficulty, progressCb, minedBlockCb) => {
  const alg = 'SHA-256'
  const nonceSuffixArray = new Uint16Array(1)
  crypto.getRandomValues(nonceSuffixArray)
  const nonceSuffix = nonceSuffixArray[0].toString()
  const start = new Date().getTime()
  let elapsedTime = 0
  let nonce = 0
  let lastNonce = 0
  const enc = new TextEncoder('utf-8')
  const headerStrBuffer = enc.encode(nonceSuffix + headerStr)
  let nonceBuffer, fullStrArr, hashBuffer, hashArray, base64String, difficulty

  const intervalTime = 1000 //ms
  interval = setInterval(() => {
    elapsedTime = Math.round(new Date(new Date().getTime() - start).getTime() / intervalTime)
    progressCb({
      hashRate: nonce - lastNonce,
      time: elapsedTime,
      nonce: nonce
    })
    lastNonce = nonce
  }, intervalTime)

  console.log(`starting hash loop with target difficulty ${targetDifficulty}`)
  while (interval) {
    nonce++
    nonceBuffer = enc.encode(nonce.toString())
    fullStrArr = new Uint8Array(nonceBuffer.length + headerStrBuffer.length)
    fullStrArr.set(nonceBuffer)
    fullStrArr.set(headerStrBuffer, nonceBuffer.length)
    hashBuffer = await crypto.subtle.digest(alg, fullStrArr.buffer)
    hashArray = new Uint8Array(hashBuffer)
    difficulty = getHashDifficulty(hashArray)

    if (difficulty >= targetDifficulty && interval) {
      base64String = btoa(String.fromCharCode(...hashArray))
      console.log(`mined block with target difficulty: ${difficulty} (target: ${targetDifficulty}), time: ${elapsedTime}s, nonce: ${nonce}, hash: ${base64String}`)
      stopMining(interval)
      await minedBlockCb(nonce + nonceSuffix)
      break
    }
  }

  console.log(`stopped or finished mining a block`)
}