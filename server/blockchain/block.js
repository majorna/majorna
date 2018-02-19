const MerkleTools = require('merkle-tools')
const crypto = require('./crypto')

/**
 * The very first block of the blockchain (no = 0).
 */
exports.genesisBlock = {
  sig: 0, // optional: if given, difficulty and nonce are not required
  header: {
    no: 0,
    prevHash: '0',
    txCount: 0,
    merkleRoot: '0',
    time: Date.parse('01 Jan 2018 00:00:00 GMT'),
    difficulty: 0,
    nonce: 0
  },
  data: []
}

/**
 * Creates a merkle tree out of given array of objects.
 */
exports.createMerkle = arr => {
  const merkleTools = new MerkleTools({hashType: 'sha256'})
  merkleTools.addLeaves(arr, true)
  merkleTools.makeTree()
  return merkleTools
}

/**
 * Creates a block with given txs and previous block data.
 */
exports.createBlock = (txs, prevBlock) => {
  const merkle = exports.createMerkle(txs)
  const header = {
    no: prevBlock.header.no + 1,
    prevHash: crypto.hashObj(prevBlock),
    txCount: txs.length,
    merkleRoot: merkle.getMerkleRoot().toString('base64'),
    time: new Date(),
    difficulty: 0,
    nonce: 0
  }
  return {
    sig: crypto.signObj(header),
    header,
    data: txs
  }
}

/**
 * Verifies a given block and all its txs.
 */
exports.verifyBlock = block => {}

/**
 * Returns a markle path leading to a given tx out of a full merkle tree.
 */
exports.getTxMerklePath = (tx, merkle) => {}

/**
 * Verifies a tx given a block header and merkle path (of full merkle tree) for that tx.
 */
exports.verifyTxInBlock = (tx, blockHeader, merklePath) => {}
