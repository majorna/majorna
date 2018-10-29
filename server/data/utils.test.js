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

  test('getRandomInt', () => {
    for (let i = 0; i < 10; i++) assert(utils.getRandomInt(0, 0) === 0)
    for (let i = 0; i < 10; i++) assert(utils.getRandomInt(1, 1) === 1)
    for (let i = 0; i < 10; i++) assert(utils.getRandomInt(utils.MAX32INT, utils.MAX32INT) === utils.MAX32INT)

    let got0, got5
    for (let i = 0; i < 500; i++) {
      const j = utils.getRandomInt(0, 5)
      console.log(j)
      assert(j >= 0 && j <= 5)
      j === 0 && (got0 = true)
      j === 5 && (got5 = true)
    }
    assert(got0 && got5)
  })
})
