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
    get: () => get('/blocks'),
    create: (no, nonce) => postJson('/blocks', {no, nonce})
  }
}

// redirect to login page upon 401
function handle401 (res) {
  if (res.status === 401) {
    window.location.replace('/login')
  } else {
    return res
  }
}

const get = url => fetch(config.server.url + url, {
  method: 'GET',
  headers: new Headers({Authorization: `Bearer ${config.server.token}`})
}).then(handle401)

const postJson = (url, data) => fetch(config.server.url + url, {
  method: 'POST',
  headers: new Headers({
    Authorization: `Bearer ${config.server.token}`,
    'Content-Type': 'application/json'
  }),
  body: JSON.stringify(data)
}).then(handle401)
