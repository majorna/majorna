const github = require('../data/github')

exports.insertBlock = async () => {
  // get last block header

  // get all txs since last block interval + 1 hours (not to allow any conflicts)

  // const signedBlock = crypto.signObj()
  // await github.insertTxInBlock(signedBlock)

  // block file frequency = 1 per week for now
  // const now = new Date()
  // const path = `${now.getFullYear()}/weeks/${utils.getWeekNumber(now)}`
}

exports.insertBlockIfRequired = async () => {
  // check if it is time to create a block
  const now = new Date()
  now.setMinutes(now.getMinutes() - 10 /* some latency to let ongoing txs to complete */)
  const prevBlockPath = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate() - 1}`
  try {
    await github.getFileContent(prevBlockPath + '-header')
  } catch (e) {
    if (e.code === 404) {
      await exports.insertBlock(prevBlockPath)
      console.log(`inserted block ${prevBlockPath}`)
    } else {
      throw e
    }
  }
}

let timerStarted = false
exports.startBlockchainTimer = () => {
  // prevent duplicate timers
  if (timerStarted) {
    return
  }
  timerStarted = true

  // start timer
  const interval = 1000/* ms */ * 60/* s */ * 10/* min */
  setInterval(async () => {
    try {
      await exports.insertBlockIfRequired()
    } catch (e) { console.error(e) }
  }, interval)
}
