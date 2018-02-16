exports.insertBlock = async () => {
  // get last block header

  // get all txs since last block interval + 1 hours (not to allow any conflicts)

  // const signedBlock = crypto.signObj()
  // await github.insertTxInBlock(signedBlock)

  // block file frequency = 1 per week for now
  // const now = new Date()
  // const path = `${now.getFullYear()}/weeks/${utils.getWeekNumber(now)}`
}

let timerStarted = false
exports.startBlockchainTimer = () => {
  // prevent duplicate timers
  if (timerStarted) {
    return
  }
  timerStarted = true

  // start timer
  const interval = 1000/*ms*/ * 60/*s*/ * 10/*min*/
  setInterval(() => {
    // check if it is time to create a block
  }, interval)
}
