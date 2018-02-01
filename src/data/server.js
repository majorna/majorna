import config from './config'

/**
 * Server API client. Uses window.fetch.
 * All functions in this object is asynchronous wince window.fetch uses promises.
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