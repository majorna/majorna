import config from './config'

/**
 * Server API client. Uses window.fetch.
 */
export default {
  users: {
    init: () => getFetch('/users/init')
  }
}

function getFetch(url) {
  return fetch(config.server.url + url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.server.token}`
    })
  })
}