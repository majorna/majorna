module.exports = class {
  schema = {
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

  constructor(sig, id, ) {
  }
}
