const crypto = require('./crypto')
const txTools = require('./txs')
const tx = require('./tx')

/**
 * Returns a new copy of the genesis block; the very first block of the blockchain.
 *
 * This is also the block schema:
 * Either trust (signature) or PoW (difficulty and nonce) are required.
 */
exports.getGenesisBlock = () => ({
  sig: '', // optional: if given, difficulty and nonce are not required
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
exports.createBlock = (txs, prevBlockOrBlockHeader) => {
  const prevHeader = prevBlockOrBlockHeader.header || prevBlockOrBlockHeader
  return {
    sig: '',
    header: {
      no: prevHeader.no + 1,
      prevHash: exports.hashBlockHeader(prevHeader),
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
 * Signs a block with majorna certificate.
 */
exports.sign = block => { block.sig = crypto.signText(exports.getHeaderStr(block.header)) }

exports.verifySignature = block => crypto.verifyText(block.sig, exports.getHeaderStr(block.header))

exports.hashBlockHeader = blockHeader => crypto.hashText(exports.getHeaderStr(blockHeader))

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
      console.log(`mined block with difficulty: ${difficulty}, nonce: ${header.nonce}, hash: ${hashBase64}`)
      return hashBase64
    }
  }
}

/**
 * Returns the mining reward for a block given the difficulty.
 */
exports.getBlockReward = difficulty => Math.pow(2, difficulty)
