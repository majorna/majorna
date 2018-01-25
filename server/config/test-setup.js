/**
 * Global Jest config. Executed only once before test suit starts to run.
 */
const db = require('../data/db')

module.exports = async () => {
  // initialize db for integration testing
  await db.seed()
}
