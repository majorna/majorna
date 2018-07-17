// redirect all logs to StackDriver before any other code is executed
const util = require('util')
const firebaseConfig = require('./config/firebase')
console.log = (...args) => {
  const logLine = util.format.apply(null, args)
  process.stdout.write(logLine + '\n')
  try {
    logLine && firebaseConfig.log.info(firebaseConfig.log.entry(logLine)).catch(e => process.stderr.write(e))
  } catch (e) {
    process.stderr.write(e + '\n')
  }
}
console.error = (...args) => {
  const logLine = util.format.apply(null, args)
  process.stderr.write(logLine + '\n')
  try {
    logLine && firebaseConfig.log.error(firebaseConfig.log.entry(logLine)).catch(e => process.stderr.write(e))
  } catch (e) {
    process.stderr.write(e + '\n')
  }
}

const server = require('./config/server')
const blockchain = require('./blockchain/blockchain')

server().then(() => blockchain.startBlockchainInsertTimer())
