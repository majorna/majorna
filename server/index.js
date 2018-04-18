const util = require('util')
const firebaseConfig = require('./config/firebase')
const server = require('./config/server')
const blockchain = require('./blockchain/blockchain')

// redirect all logs to StackDriver
console.log = (...args) => {
  const logLine = util.format.apply(null, args)
  process.stdout.write(logLine + '\n')
  firebaseConfig.log.info(firebaseConfig.log.entry(logLine)).catch(e => process.stderr.write(e))
}
console.error = (...args) => {
  const logLine = util.format.apply(null, args)
  process.stderr.write(logLine + '\n')
  firebaseConfig.log.error(firebaseConfig.log.entry(logLine)).catch(e => process.stderr.write(e))
}

server().then(() => blockchain.startBlockchainInsertTimer())
