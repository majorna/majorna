// const db = require('../data/db')
const github = require('../data/github')
const crypto = require('./crypto')

exports.makeBlock = async () => {
  // get last block header

  // get all txs since last block interval + 1 hours (not to allow any conflicts)

  const signedBlock = crypto.signObj()
  await github.insertTxInBlock(signedBlock)
}

exports.blockPeriodCheck = async () => {
  // check if it is time to create a block
}
