const env = window.document.URL.includes('http://localhost:3000') ? 'development' : 'production'
const isDev = env === 'development'
const isProd = env === 'production'

/**
 * Global UI configuration.
 */
export default {
  app: {
    env,
    isDev,
    isProd,
  },
  server: {
    url: isDev ? 'http://localhost:3001' : 'https://majorna.herokuapp.com',
    token: null // lazy initialized
  }
}
