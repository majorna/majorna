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
    make: (to, amount, showSenderName) => postJson('/txs', {to, amount, showSenderName})
  },
  blocks: {
    create: nonce => postJson('/blocks', {nonce})
  },
  shop: {
    createStripeCharge: (token, usdAmount) => postJson('/shop/stripe-charge', {token, usdAmount}),
    getCoinbaseCommerceChargeUrl: () => get('/shop/coinbase-commerce-charge-url')
  },
  coinbase: {
    usdExchangeRates: () => fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD')
  },
  peers: {
    getSelfLocation: () => fetch('https://geoip-db.com/json/'),
    get: () => get('/peers'),
    join: (lat, lon) => postJson('/peers', {lat, lon}),
    signal: (userId, signalData) => postJson(`/peers/${userId}/signal`, {signalData}),
  },
  notifications: {
    clear: () => del('/notifications')
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

const del = url => fetch(config.server.url + url, {
  method: 'DELETE',
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
