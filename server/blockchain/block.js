const assert = require('assert')
const crypto = require('./crypto')
const txTools = require('./txs')
const tx = require('./tx')

/**
 * Returns a new copy of the genesis block; the very first block of the blockchain.
 */
exports.getGenesisBlock = () => ({
  sig: '', // optional: if given, difficulty and nonce are not obligatory
  header: {
    no: 1,
    prevHash: '',
    txCount: 0,
    merkleRoot: '',
    time: new Date('01 Jan 2018 00:00:00 UTC'),
    difficulty: 0, // optional: if sig is not present, should be > 0
    nonce: 0 // optional: if sig is not present, should be > 0
  },
  txs: []
})

/**
 * Creates a block with given txs and previous block or block header.
 */
exports.createBlock = (txs, prevBlockHeader) => {
  return {
    sig: '',
    header: {
      no: prevBlockHeader.no + 1,
      prevHash: exports.hashBlockHeader(prevBlockHeader),
      txCount: txs.length,
      merkleRoot: (txs.length && txTools.createMerkle(txs).getMerkleRoot().toString('base64')) || '', // block are allowed to have no txs in them
      time: new Date(),
      difficulty: 0,
      nonce: 0
    },
    txs: txs.map(t => tx.getObj(t))
  }
}

/**
 * Serializes block or block header into indented JSON.
 */
exports.toJson = blockOrBlockHeader => JSON.stringify(blockOrBlockHeader, null, 2)

/**
 * Deserialize a JSON serialized block or block header into an object.
 */
exports.fromJson = blockOrBlockHeaderJson => {
  const blockOrHeader = JSON.parse(blockOrBlockHeaderJson)

  // fix block header time
  const header = blockOrHeader.header || blockOrHeader
  header.time = new Date(header.time)

  // fix individual tx times
  blockOrHeader.header && blockOrHeader.txs.forEach(tx => { tx.time = new Date(tx.time) })

  return blockOrHeader
}

/**
 * Concatenates the the given block header into a regular string, fit for hashing.
 * Puts the nonce first to prevent internal hash state from being reused. In future we can add more memory intensive prefixes.
 * @param blockHeader - Block header object.
 * @param skipNonce - Don't include nonce in the string. Useful for mining. False by default.
 */
exports.getHeaderStr = (blockHeader, skipNonce) =>
  '' + (skipNonce ? '' : blockHeader.nonce) +
  blockHeader.no + blockHeader.prevHash + blockHeader.txCount +
  blockHeader.merkleRoot + blockHeader.time.getTime() + blockHeader.difficulty

/**
 * Returns the hash of a given block header.
 */
exports.hashBlockHeader = blockHeader => crypto.hashText(exports.getHeaderStr(blockHeader))

/**
 * Signs a block with majorna certificate.
 */
exports.sign = block => { block.sig = crypto.signText(exports.getHeaderStr(block.header)) }

/**
 * Verifies a given block's signature.
 */
exports.verifySignature = block => crypto.verifyText(block.sig, exports.getHeaderStr(block.header))

/**
 * Verifies the given block. Requires the previous block header for the verification.
 * Throws an assert.AssertionError with a relevant message, if the verification fails.
 */
exports.verifyBlock = (block, prevBlockHeader) => {
  assert(block.header.no === prevBlockHeader.no + 1)
  assert(block.header.prevHash.length === 44)
  assert(block.header.txCount === block.txs.length)
  if (block.txs.length) {
    assert(block.header.merkleRoot.length === 44)
  } else {
    assert(block.header.merkleRoot === '')
  }
  assert(block.header.time.getTime() <= (new Date()).getTime())

  if (block.sig) {
    assert(block.sig.length === 96)
    assert(block.verifySignature(block))
    assert(block.header.difficulty === 0)
    assert(block.header.nonce === 0)
  } else {
    assert(!block.sig)
    assert(block.header.difficulty > 0)
    assert(block.header.nonce > 0)
  }
}

/**
 * Accepts a hash as an Uint8Array array, returns the difficulty as an integer.
 * Node.js Buffer implement Uint8Array API so buffer instances are also acceptable.
 */
exports.getHashDifficulty = hash => {
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
 * Calculates nonce (mines) until a hash of required difficulty is found for the block.
 * @param blockOrHeader - Block or block header (as object) to mine.
 * @param targetDifficulty - Used for testing only. Otherwise difficulty field in the block header is used.
 */
exports.mineBlock = (blockOrHeader, targetDifficulty) => {
  const header = blockOrHeader.header || blockOrHeader
  targetDifficulty = targetDifficulty || header.difficulty

  let difficulty
  let hash
  let nonce = 0
  const str = exports.getHeaderStr(header, true) // store header string without nonce as an optimization
  while (true) {
    nonce++
    hash = crypto.hashTextToBuffer(nonce + str)
    difficulty = exports.getHashDifficulty(hash)
    if (difficulty >= targetDifficulty) {
      header.nonce = nonce
      header.difficulty = targetDifficulty
      const hashBase64 = hash.toString('base64')
      console.log(`mined block with difficulty: ${difficulty} (target: ${targetDifficulty}), nonce: ${header.nonce}, hash: ${hashBase64}`)
      return hashBase64
    }
  }
}

/**
 * Returns the mining reward for a block given the difficulty.
 */
exports.getBlockReward = difficulty => 2 * difficulty
