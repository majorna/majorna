exports.sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

exports.isCloseToDate = (date, closeToDate = new Date(), varianceSeconds = 30) =>
  date.getTime() + varianceSeconds * 1000 > closeToDate.getTime() &&
  date.getTime() - varianceSeconds * 1000 < closeToDate.getTime()

exports.getRandomInt = max => Math.floor(Math.random() * Math.floor(max))
