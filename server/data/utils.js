const assert = require('assert')
const crypto = require('crypto')

exports.sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

exports.isCloseToDate = (date, closeToDate = new Date(), varianceSeconds = 30) =>
  date.getTime() + varianceSeconds * 1000 > closeToDate.getTime() &&
  date.getTime() - varianceSeconds * 1000 < closeToDate.getTime()

exports.MAX32INT = Math.pow(2, 32) - 1

/**
 * A crypto safe random integer between given min (inclusive) and max (inclusive).
 */
exports.getRandomInt = (min, max) => {
  assert(min >= 0 && min <= exports.MAX32INT && max >= 0 && max <= exports.MAX32INT, `Min and max must be greater than or equal to ${0} and less than or equal to ${exports.MAX32INT}`)
  if (min === max) {
    return max
  }
  const array = new Uint32Array(1)
  crypto.getRandomValues ? crypto.getRandomValues(array) : crypto.randomFillSync(array)
  return (array[0] + min) % (max + 1)
}

/**
 * A random string (not crypto safe) of length 11.
 */
exports.getRandomStr = () => Math.random().toString(36).replace('0.', '') // len=11

exports.getWeekNumber = date => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

/**
 * Instances of this error type will have their 'message' field shown to users.
 */
exports.UserVisibleError = class extends Error {
  constructor (msg, httpStatusCode = 400) {
    super(msg)
    this.expose = true // error message will be sent to user by Koa
    this.status = httpStatusCode
  }
}

/**
 * Strips majorna:/mj: prefixes from a string, if any.
 */
exports.stripPrefix = str => str.startsWith('mj:') ? str.substring(3) : str.startsWith('majorna:') ? str.substring(8) : str
