const env = window.document.URL.includes('http://localhost:3000') ? 'development' : 'production'
const isDev = env === 'development'

/**
 * Global UI configuration.
 */
export default {
  app: {
    env,
    isDev,
    isProd: env === 'production',
  },
  server: {
    url: isDev ? 'http://localhost:3001' : 'https://majorna.herokuapp.com',
    token: null // lazy initialized
  }
}
