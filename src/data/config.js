const env = window.document.URL.includes('http://localhost:3000') ? 'development' : 'production'
const isDev = env === 'development'
const isProd = env === 'production'

const domain = 'getmajorna.com'

/**
 * Global UI configuration.
 */
export default {
  app: {
    env,
    isDev,
    isProd,
  },
  hosting: {
    domain,
    url: `https://${domain}`
  },
  server: {
    url: isDev ? 'http://localhost:3001' : 'https://majorna.herokuapp.com',
    token: null // lazy initialized
  },
  stripe: {
    publishableKey: isDev ? 'pk_test_98A7TrR0G8W7SyUIdjoQytZj' : 'pk_live_5a1IQUuynng65TjcwmnGQkvY'
  }
}
