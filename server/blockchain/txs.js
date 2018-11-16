const MerkleTools = require('merkle-tools')
const tx = require('./tx')
const crypto = require('../utils/crypto')

/**
 * Creates a merkle tree out of given txs.
 */
exports.createMerkle = txs => {
  const strs = txs.map(t => tx.getStr(t))
  const merkleTools = new MerkleTools({ hashType: crypto.algo })
  merkleTools.addLeaves(strs, true)
  merkleTools.makeTree()
  return merkleTools
}

/**
 * Returns a merkle proof for a given tx and the merkle tree.
 */
exports.getTxProof = (tx, merkle) => {}

/**
 * Verifies a tx given a block header and merkle proof for that tx.
 */
exports.verifyTxInBlock = (tx, blockHeader, merkleProof) => {
  // todo: merkle-tools checks the proof without checking the tree depth hence enabling: https://en.wikipedia.org/wiki/Merkle_tree#Second_preimage_attack
  // we already store txCount in header so can easily verify the tree depth ourselves on top of merkle-tools path verification
}
