import config from './config'

/**
 * Server API client. Uses window.fetch.
 * All functions in this object is asynchronous since window.fetch uses promises.
 *
 * Usage:
 * const res = await server.blocks.get()
 * const blockObj = await res.json()
 */
export default {
  debug: {
    ping: () => get('/ping')
  },
  users: {
    init: () => get('/users/init'),
    get: id => get('/users/' + id)
  },
  txs: {
    make: (to, amount) => postJson('/txs', {to, amount})
  },
  blocks: {
    create: nonce => postJson('/blocks', {nonce})
  },
  miners: {
    getLocation: () => fetch('https://geoip-db.com/json/'),
    post: (lat, lon) => postJson('/miners', {lat, lon})
  },
  coinbase: {
    usdExchangeRates: () => fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD')
  }
}

// redirect to login page upon 401
function handle401 (res) {
  if (res.status === 401) {
    console.error(res)
    window.location.replace('/login')
  } else {
    return res
  }
}

// redirect to login upon network error
function handleNetworkError (e) {
  if (e instanceof TypeError) {
    // todo: show a message to user about the network error
    throw e
  }
}

const get = url => fetch(config.server.url + url, {
  method: 'GET',
  headers: new Headers({Authorization: `Bearer ${config.server.token}`})
}).then(handle401).catch(handleNetworkError)

const postJson = (url, data) => fetch(config.server.url + url, {
  method: 'POST',
  headers: new Headers({
    Authorization: `Bearer ${config.server.token}`,
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify(data)
}).then(handle401).catch(handleNetworkError)
