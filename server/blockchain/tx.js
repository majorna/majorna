const crypto = require('./crypto')

exports.txSchema = {
  sig: '', // signature of the tx, signed by the sender (or majorna on behalf of sender)
  id: '', // ID of the transaction
  from: {
    id: '', // ID of the sender
    balance: 0 // balance of sender before transaction
  },
  to: {
    id: '', // ID of the receiver
    balance: 0 // balance of receiver before transaction
  },
  time: new Date(), // time of the transaction
  amount: 0 // amount being sent
}

exports.getStr = tx =>
  '' + tx.id + tx.from.id + tx.from.balance + tx.to.id + tx.to.balance + tx.time.getTime() + tx.amount

exports.getObj = tx => ({
  sig: tx.sig,
  id: tx.id,
  from: {id: tx.from.id, balance: tx.from.balance},
  to: {id: tx.to.id, balance: tx.to.balance},
  time: new Date(tx.time.getTime()),
  amount: tx.amount
})

exports.sign = tx => {
  const sigTx = exports.getObj(tx)
  sigTx.sig = crypto.signText(exports.getStr(sigTx))
  return sigTx
}
