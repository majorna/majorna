function getMerkle(tx) {
  return {
    hash: 0,
    l: {},
    r: {}
  }
}

exports.createBlock = (txs, prevBlock) => {
  const merkle = getMerkle(txs)
  const block = {
    no: prevBlock.no + 1,
    time: new Date(),
    prevHash: prevBlock.hash,
    difficulty: 0,
    nonce: 0,
    txs,
    txsMerkle
  }
  const hash = null
  return {hash, block}
}