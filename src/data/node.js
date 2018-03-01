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
 * Returned promise is not resolved until a block is found.
 * Awaiting this function will block until a block is found or {stopMining} is called.
 */
export const mineBlock = async (headerStr, difficulty, progressCb, minedBlockCb) => {
  const alg = 'SHA-256'
  const start = new Date().getTime()
  let nonce = 0
  let lastNonce = 0
  const enc = new TextEncoder('utf-8')
  const headerStrBuffer = enc.encode(headerStr)
  let nonceBuffer, fullStrArr, hashBuffer, hashArray, base64String

  interval = setInterval(() => {
    progressCb({
      hashRate: nonce - lastNonce,
      time: new Date(new Date().getTime() - start)
    })
    lastNonce = nonce
  }, 1000)

  // todo: since data to be hashed is so small, async/await cycle takes a lot longer than actual hashing
  // (note: since it is async, we can massively parallelize this)
  // node-forge is about 10x faster here (but needs breaks in the loop with setImmediate not to block the event loop forever)
  // alternatively we can increase the input text size to make async call overhead negligible / or just sha3 or PoS variant
  let i, found
  console.log(`starting mining loop with difficulty ${difficulty}`)
  while (interval) {
    nonce++
    nonceBuffer = enc.encode(nonce.toString())
    fullStrArr = new Uint8Array(nonceBuffer.length + headerStrBuffer.length)
    fullStrArr.set(nonceBuffer)
    fullStrArr.set(headerStrBuffer, nonceBuffer.length)
    hashBuffer = await crypto.subtle.digest(alg, fullStrArr.buffer)
    hashArray = new Uint8Array(hashBuffer)
    i = 0
    found = true
    for (;i < difficulty; i++) {
      if (hashArray[i] !== 0) found = false
    }
    if (found && interval) {
      base64String = btoa(String.fromCharCode(...hashArray))
      console.log(`mined block with difficulty: ${difficulty}, nonce: ${nonce}, hash: ${base64String}`)
      stopMining(interval)
      minedBlockCb()
      break
    }
  }

  console.log(`stopped or finished mining`)
}
