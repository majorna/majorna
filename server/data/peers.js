const utils = require('./utils')
const db = require('./db')

const miners = [] // todo: purge offline miners before interacting with this array (heroku restart does the business once a day, for the moment)

miners.schema = {
  lat: 1.1234,
  lon: 1.1234,
  lastOnline: new Date(),
  onInitPeerList: [
    {
      id: 'abcd1234',
      resolve: () => {},
      reject: () => {},
      time: new Date()
    }
  ]
}

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
    miners.push({ id, lat, lon, lastOnline: lastOnline, onInitPeerList: [] })
  }

  return miners.map(m => ({ lat: m.lat, lon: m.lon }))
}

/**
 *
 * @param id - ID of the user that is calling this function.
 * @param signalData - WebRTC signal data produced by the user calling this function.
 * @returns {Promise<*>}
 */
exports.initPeer = async (id, signalData) => {
  // get a random miner from list that is not us
  const filteredMiners = miners.filter(m => m.id !== id)
  const miner = filteredMiners[utils.getRandomInt(0, filteredMiners.length - 1)]
  await db.addNotification({ type: 'webRTCInit', signalData })
  await new Promise((resolve, reject) => {
    miner.onInitPeerList.push({ resolve, reject, time: new Date() })
  })
}
