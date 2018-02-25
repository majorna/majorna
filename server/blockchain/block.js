const MerkleTools = require('merkle-tools')
const crypto = require('./crypto')
const tx = require('./tx')

/**
 * The very first block of the blockchain (no = 0).
 * Either trust (signature) or PoW (difficulty and nonce) are required.
 */
exports.genesisBlock = {
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
  data: []
}

exports.getStr = block => {
  let str = '' + block.no + block.prevHash + block.txCount + block.merkleRoot + block.time.getTime() + block.difficulty + block.nonce
  block.date.forEach(t => str += tx.getStr(t))
  return str
}

exports.sign = block => {
  const sigBlock = {
    header: {
      no: block.no,
      prevHash: block.prevHash,
      txCount: block.txCount,
      merkleRoot: block.merkleRoot,
      time: block.time,
      difficulty: block.difficulty,
      nonce: block.nonce
    },
    data: block.data.map(t => tx.getObj(t))
  }
  sigBlock.sig = crypto.signText(exports.getStr(sigBlock.header))
  return sigBlock
}

/**
 * Creates a merkle tree out of given txs.
 */
exports.createMerkle = txs => {
  const hashes = txs.map(t => tx.hash(t))
  const merkleTools = new MerkleTools({hashType: crypto.algo})
  merkleTools.addLeaves(hashes)
  merkleTools.makeTree()
  return merkleTools
}

/**
 * Creates a block with given txs and previous block or block header.
 */
exports.createSignedBlock = (txs, prevBlock, mine = false) => {
  const prevHeader = prevBlock.header || prevBlock
  const header = {
    no: prevHeader.no + 1,
    prevHash: crypto.hashObj(prevHeader),
    txCount: txs.length,
    merkleRoot: (txs.length && exports.createMerkle(txs).getMerkleRoot().toString('base64')) || '',
    time: new Date(),
    difficulty: 0,
    nonce: 0
  }
  let block = {
    sig: '',
    header,
    data: txs
  }
  mine && exports.mineBlock(block)
  block.sig = crypto.signObj(header)
  return block
}

/**
 * Verifies a given block header and data (if given).
 */
exports.verifyBlock = block => {
  // verify signature if present

  // verify PoW otherwise
}

/**
 * Returns a merkle proof for a given tx and the merkle tree.
 */
exports.getTxProof = (tx, merkle) => {}

/**
 * Verifies a tx given a block header and merkle proof for that tx.
 */
exports.verifyTxInBlock = (tx, blockHeader, merkleProof) => {}

/**
 * Calculates nonce (mines) until a hash of required difficulty is found for the block.
 */
exports.mineBlock = block => {
  const header = block.header
  header.difficulty = 1 // todo: difficulty should depend on average block timer
  const hashPrefix = '0'.repeat(header.difficulty) // todo: this is exponential like growth!

  let hash
  while (true) {
    header.nonce++
    hash = crypto.hashObj(header)
    if (hash.substring(0, header.difficulty) === hashPrefix) {
      console.log(`mined block with nonce: ${header.nonce}, hash: ${hash}`)
      return
    }
  }
}
