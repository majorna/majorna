const crypto = require('.crypto')

/**
 *
 * @param id - ID of the transaction.
 * @param fromId - ID of the sender.
 * @param fromBalance - Balance of sender before transaction.
 * @param toId - ID of receiver.
 * @param toBalance - Balance of receiver before transaction.
 * @param time - Unix timestamp of the transaction.
 * @param amount - Amount being sent.
 */
exports.getCryptoStr = (id, fromId, fromBalance, toId, toBalance, time, amount) =>
  '' + id + fromId + fromBalance + toId + toBalance + time.getTime() + amount

exports.sign = (id, fromId, fromBalance, toId, toBalance, time, amount) =>
  ({id,
    sig: crypto.signText(exports.getCryptoStr(id, fromId, fromBalance, toId, toBalance, time, amount)),
    from: {id: fromId, balance: fromBalance},
    to: {id: toId, balance: toBalance},
    time,
    amount
  })

exports.hash = (id, fromId, fromBalance, toId, toBalance, time, amount) =>
  crypto.hashText(exports.getCryptoStr(id, fromId, fromBalance, toId, toBalance, time, amount))
