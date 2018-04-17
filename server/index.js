const util = require('util')
const firebaseConfig = require('./config/firebase')
const server = require('./config/server')
const blockchain = require('./blockchain/blockchain')

// redirect all logs to StackDriver
console.log = (...args) => {
  const log = util.format.apply(null, args) + '\n'
  process.stdout.write(log)
  firebaseConfig.log.info(firebaseConfig.log.entry(log)).catch(e => process.stderr.write(e))
}
console.error = (...args) => {
  const log = util.format.apply(null, args) + '\n'
  process.stderr.write(log)
  firebaseConfig.log.error(firebaseConfig.log.entry(log)).catch(e => process.stderr.write(e))
}

server().then(() => blockchain.startBlockchainInsertTimer())
