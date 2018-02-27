exports.receiveTxs = () => {
  // no duplicates
  // no balance below 0
  // valid signatures
}

exports.receiveBlock = () => {
  // validate each tx signature unless block is signed by a trusted key
}

exports.initSimplePeer = () => {}

exports.mineBlock = async () => {
  // get txs for the last 10 minute period and start mining
  const now = new Date() // get time snapshot to prevent drift

  const start = new Date(now.getTime())
  start.setMilliseconds(0)
  start.setSeconds(0)
  start.setMinutes(now.getMinutes() - now.getMinutes() % 10)

  const end = new Date(now.getTime())
  end.setMilliseconds(0)
  end.setSeconds(0)
  end.setMinutes(now.getMinutes() - 10 - now.getMinutes() % 10)

  console.log(`starting to mine block for txs between [${start}] and [${end}]`)
  const txsSnap = await this.props.db.collection('txs').where('time', '>=', start).where('time', '<', end).get()
  const txs = txsSnap.docs.map(doc => doc.data())

  console.log(txs)
}
