exports.sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

exports.isCloseToDate = (date, closeToDate = new Date(), varianceSeconds = 30) =>
  date.getTime() + varianceSeconds * 1000 > closeToDate.getTime() &&
  date.getTime() - varianceSeconds * 1000 < closeToDate.getTime()

exports.getRandomInt = max => Math.floor(Math.random() * Math.floor(max))

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
