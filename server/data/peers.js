const utils = require('./utils')

const miners = [] // todo: purge offline miners before interacting with this array (heroku restart does the business once a day, for the moment)

/**
 * Adds a miner to the miner map. If the miner exists on the map, the coordinates are updated.
 * Returns list of miners with lat & lon properties.
 */
exports.addMiner = (id, lat, lon) => {
  const lastOnline = new Date()
  const miner = miners.find(m => m.id === id)
  if (miner) {
    miner.lat = lat
    miner.lon = lon
    miner.lastOnline = lastOnline
  } else {
    miners.push({ id, lat, lon, lastOnline: lastOnline })
  }

  return miners.map(m => ({ lat: m.lat, lon: m.lon }))
}

exports.initPeer = async (id, signalData) => {
  // get a random miner from list that is not us
  const filteredMiners = miners.filter(m => m.id !== id)
  const miner = filteredMiners[utils.getRandomInt(filteredMiners.length - 1)] // todo: add a test for getRandomInt max inclusiveness
  await db.addNotification({type: 'webRTCInit', signalData})
  return new Promise((resolve, reject) => {
    miner.onInitPeerList.push({resolve, reject, time: new Date()})
  })
}
