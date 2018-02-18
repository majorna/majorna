const assert = require('assert')
const utils = require('./utils')

suite('utils', () => {
  test('stripPrefix', () => {
    const addr = '12hjdsdf098769ysgadfpj'
    const mjPrefix = 'mj:'
    const majornaPrefix = 'majorna:'
    const notPrefix = 'asdf8ysahdf:oiuadsf45hss'

    assert(utils.stripPrefix(addr) === addr)
    assert(utils.stripPrefix(mjPrefix + addr) === addr)
    assert(utils.stripPrefix(majornaPrefix + addr) === addr)
    assert(utils.stripPrefix(notPrefix) === notPrefix)
  })
})
