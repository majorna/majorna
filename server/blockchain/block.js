/**
 * Block no = 0.
 */
exports.genesisBlock = {
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
  return {
    hash: 0,
    l: {},
    r: {}
  }
}

/**
 * Creates a block with given txs and previous block data.
 */
exports.createBlock = (txs, prevBlock) => {
  const merkle = exports.createMerkle(txs)
  return {
    header: {
      no: prevBlock.no + 1,
      prevHash: prevBlock.hash,
      txCount: txs.length,
      merkleRoot: merkle.hash,
      time: new Date(),
      difficulty: 0,
      nonce: 0
    },
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
