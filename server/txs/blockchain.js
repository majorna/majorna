exports.createMerkle = txs => {
  return {
    hash: 0,
    l: {},
    r: {}
  }
}

exports.createBlock = (txs, prevBlock) => {
  // todo: verify all tx signatures first
  const merkle = exports.createMerkle(txs)
  return {
    txs,
    merkle,
    header: {
      no: prevBlock.no + 1,
      prevHash: prevBlock.hash,
      merkleRoot: merkle.hash,
      time: new Date(),
      txCount: txs.length,
      difficulty: 0,
      nonce: 0
    }
  }
}
