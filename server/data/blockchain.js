function getMerkle(tx) {
  return {
    hash: 0,
    l: {},
    r: {}
  }
}

exports.createBlock = (txs, prevBlock) => {
  const merkle = getMerkle(txs)
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