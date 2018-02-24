const crypto = require('.crypto')

exports.txSchema = {
  id: 'string', // ID of the transaction
  from: {
    id: 'string', // ID of the sender
    balance: 0 // balance of sender before transaction
  },
  to: {
    id: 'string', // ID of the receiver
    balance: 0 // balance of receiver before transaction
  },
  time: 0, // Unix timestamp of the transaction
  amount: 0 // amount being sent
}

exports.getCryptoStr = tx =>
  '' + tx.id + tx.from.id + tx.from.balance + tx.to.id + tx.to.balance + tx.time.getTime() + tx.amount

exports.sign = tx =>
  ({id: tx.id,
    sig: crypto.signText(exports.getCryptoStr(tx)),
    from: {id: tx.from.id, balance: tx.from.balance},
    to: {id: tx.to.id, balance: tx.to.balance},
    time: tx.time,
    amount: tx.amount
  })

exports.hash = tx => crypto.hashText(exports.getCryptoStr(tx))
