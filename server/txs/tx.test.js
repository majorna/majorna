const assert = require('assert')
const tx = require('./tx')

// todo: validate tx insert @github (needs task about cleaning up github repo before each test run [not after to have debug info left])

suite('tx', () => {
  test('stripPrefix', () => {
    const addr = '12hjdsdf098769ysgadfpj'
    const mjPrefix = 'mj:'
    const majornaPrefix = 'majorna:'
    const notPrefix = 'asdf8ysahdf:oiuadsf45hss'

    assert(tx.stripPrefix(addr) === addr)
    assert(tx.stripPrefix(mjPrefix + addr) === addr)
    assert(tx.stripPrefix(majornaPrefix + addr) === addr)
    assert(tx.stripPrefix(notPrefix) === notPrefix)
  })
})
