const assert = require('assert')
const config = require('../config/config')
const crypto = require('./crypto')
const txsUtils = require('./txs')
const txUtils = require('./tx')

const hashArrTemplate32 = new Uint32Array(2 * 256 * 1024)
let seed = 20180101 % 2147483647
for (let i = 0; i < hashArrTemplate32.length; i++) {
  hashArrTemplate32[i] = 0
  for (let j = 0; j < 64; j++) hashArrTemplate32[i] += (seed = seed * 16807 % 2147483647)
}
const hashArrTemplate = new Uint8Array(hashArrTemplate32.buffer)

const hashArr = Buffer.alloc(2 * 1024 * 1024, hashArrTemplate)

function getHeaderStrHashUsingHashPalette (str) {
  hashArr.fill(hashArrTemplate, 0, 5000) // so hashArr will not have data overwritten by a longer previous headerArr
  const headerArr = Buffer.from(str, 'utf8')
  hashArr.set(headerArr)
  return crypto.hashTextOrBufferToBuffer(hashArr)
}

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
    minDifficulty: 0, // optional: if sig is not present, should be > 0
    nonce: 0 // optional: if sig is not present, should be > 0
  },
  txs: []
})

/**
 * Creates a block with given txs and previous block or block header.
 */
exports.create = (txs, prevBlockHeader, now = new Date()) => {
  return {
    sig: '',
    header: {
      version: 2,
      no: prevBlockHeader.no + 1,
      prevHash: exports.hashHeaderToStr(prevBlockHeader),
      prevPow: exports.hashHeaderToPowStr(prevBlockHeader),
      txCount: txs.length,
      merkleRoot: (txs.length && txsUtils.createMerkle(txs).getMerkleRoot().toString('hex')) || '', // block are allowed to have no txs in them
      time: now,
      minDifficulty: 0,
      nonce: 0
    },
    txs: txs.map(t => txUtils.getObj(t))
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
 * @param difficulty - If specified, this difficulty will be used instead of the one in header.
 */
exports.getHeaderStr = (blockHeader, skipNonce, difficulty) =>
  '' + (skipNonce ? '' : blockHeader.nonce) +
  blockHeader.no + blockHeader.prevHash + blockHeader.txCount +
  blockHeader.merkleRoot + blockHeader.time.getTime() + (difficulty || blockHeader.minDifficulty)

/**
 * Returns the hash of a given block header.
 */
exports.hashHeaderToStr = blockHeader =>
  crypto.hashTextOrBufferToBuffer(Buffer.from(exports.getHeaderStr(blockHeader), 'utf8')).toString(crypto.encoding)

/**
 * Returns the POW hash of a given block header.
 */
exports.hashHeaderToPowStr = blockHeader =>
  getHeaderStrHashUsingHashPalette(exports.getHeaderStr(blockHeader)).toString(crypto.encoding)

/**
 * Signs a block with majorna certificate.
 */
exports.sign = block => {
  block.sig = crypto.signTextOrBufferToText(exports.getHeaderStr(block.header))
  return block
}

/**
 * Verifies a given block's signature.
 */
exports.verifySignature = block => crypto.verifyTextOrBuffer(block.sig, exports.getHeaderStr(block.header))

/**
 * Hashes a given block header and checks if the nonce matches the claimed difficulty.
 */
// exports.verifyHeaderHash = blockHeader => exports.getHashDifficulty(exports.hashHeaderToBuffer(blockHeader)) >= blockHeader.minDifficulty

/**
 * Verifies the given block. Requires the previous block header for the verification.
 * Returns true if block is valid. Throws an assert.AssertionError with a relevant message, if the verification fails.
 */
exports.verify = (block, prevBlockHeader) => {
  // verify schema
  assert(prevBlockHeader && prevBlockHeader.no, 'Invalid previous block header.')
  assert(block.header.no === prevBlockHeader.no + 1, `Block header number is not correct. Expected ${prevBlockHeader.no + 1}, got ${block.header.no}.`)
  assert(block.header.prevHash, 'Previous block hash should be provided.')
  assert(block.header.prevHash.length === 64, `Previous block hash length is invalid. Expected ${64}, got ${block.header.prevHash.length}.`)
  assert(block.header.txCount === block.txs.length, `Tx count in header does not match the actual tx count in block. Expected ${block.txs.length}, got ${block.header.txCount}.`)
  if (block.header.txCount) {
    assert(block.header.merkleRoot, 'Merkle root should be provided.')
    assert(block.header.merkleRoot.length === 64, `Merkle root length is invalid. Expected ${64}, got ${block.header.merkleRoot.length}.`)
  } else {
    assert(block.header.merkleRoot === '', 'Merkle root should be an empty string if block contains no txs.')
  }
  assert(block.header.time, 'Block header does not have a time.')
  assert(block.header.time.getTime() > exports.getGenesisBlock().header.time.getTime(), 'Block time is invalid or is before the genesis.')
  if (block.sig) {
    assert(block.sig.length === 140 || block.sig.length === 142 || block.sig.length === 144, `Block signature length is invalid. Expected ${140}, ${142} or ${144}, got ${block.sig.length}.`)
    block.header.minDifficulty > 0 && assert(block.header.nonce > 0, 'Nonce should be > 0 if difficulty is > 0.')
    block.header.nonce > 0 && assert(block.header.minDifficulty > 0, 'Difficulty should be > 0 if nonce is > 0.')
  } else {
    assert(block.header.minDifficulty > 0, 'Block difficulty should be > 0 for unsigned blocks.')
    assert(block.header.nonce > 0, 'Block nonce should be > 0 for unsigned blocks.')
  }

  // verify contents
  const prevBlockHash = exports.hashHeaderToStr(prevBlockHeader)
  assert(block.header.prevHash === prevBlockHash, `Given previous block header hash does not match. Expected ${prevBlockHash}, got ${block.header.prevHash}.`)
  if (block.header.txCount) {
    const merkleRoot = txsUtils.createMerkle(block.txs).getMerkleRoot().toString('hex')
    assert(block.header.merkleRoot === merkleRoot, `Merkle root is not valid. Expected ${merkleRoot}, got ${block.header.merkleRoot}`)
    block.txs.forEach(tx => assert(txUtils.verify(tx), `One of the txs in given block was invalid. Invalid tx: ${tx}`))
  }
  if (block.sig) {
    assert(exports.verifySignature(block), 'Block signature verification failed.')
  }
  if (!block.sig || block.header.minDifficulty > 0 || block.header.nonce > 0) {
    const headerStr = exports.getHeaderStr(block.header)
    const difficulty = exports.getHashDifficultyFromStr(headerStr)
    assert(difficulty >= block.header.minDifficulty,
      `Nonce does not match claimed difficulty. Expected difficulty ${block.header.minDifficulty}, got ${difficulty} (hash: ${getHeaderStrHashUsingHashPalette(headerStr)}).`)
  }

  return true
}

/**
 * Accepts a hash as an Uint8Array/Buffer, returns the difficulty as an integer.
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
 * Hashes given header string with optional nonce and calculates difficulty.
 */
exports.getHashDifficultyFromStr = (headerStr, nonce = '') => exports.getHashDifficulty(getHeaderStrHashUsingHashPalette('' + nonce + headerStr))

/**
 * Calculates nonce (mines) until a hash of required difficulty is found for the block.
 * @param blockOrHeader - Block or block header (as object) to mine.
 */
exports.mineBlock = (blockOrHeader) => {
  const header = blockOrHeader.header || blockOrHeader
  const miningRes = exports.mineHeaderStr(exports.getHeaderStr(header, true), header.minDifficulty)
  header.nonce = miningRes.nonce
  return miningRes
}

/**
 * Calculates nonce (mines) until a hash of required difficulty is found for the given block header string.
 */
exports.mineHeaderStr = (blockHeaderStr, targetDifficulty) => {
  let difficulty
  let powHashBuffer
  let nonce = 0
  while (true) {
    nonce++
    powHashBuffer = getHeaderStrHashUsingHashPalette(nonce + blockHeaderStr)
    difficulty = exports.getHashDifficulty(powHashBuffer)
    if (difficulty >= targetDifficulty) {
      const powHashHex = powHashBuffer.toString('hex')
      console.log(`mined block with difficulty: ${difficulty} (target: ${targetDifficulty}), nonce: ${nonce}, hash: ${powHashHex}`)
      return {powHashBuffer, powHashHex, difficulty, nonce}
    }
  }
}

/**
 * Returns the mining reward for a block given the difficulty.
 */
exports.getBlockReward = difficulty => Math.ceil(difficulty * config.blockchain.difficultyRewardMultiplier)
