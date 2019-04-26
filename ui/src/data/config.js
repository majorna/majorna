const env = navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom') ? 'test' :
  window.document.URL.includes('http://localhost:3000') ? 'development' : 'production'
const isDev = env === 'development'
const isTest = env === 'test' // unit tests (Jest)
const isProd = env === 'production'

const domain = 'getmajorna.com'

const blockchainUrl = isProd ? 'https://github.com/majorna/blockchain' : 'https://github.com/majorna/test-blockchain'

/**
 * Global UI configuration.
 */
const config = {
  app: {
    env,
    isDev,
    isTest,
    isProd,
    isTestnet: false
  },
  hosting: {
    domain,
    url: `https://${domain}`
  },
  server: {
    url: isDev ? 'http://localhost:3001' : 'https://majorna.herokuapp.com',
    token: null // lazy initialized
  },
  crypto: {
    signAlgo: 'ECDSA',
    hashAlgo: 'SHA-256',
    textEncoding: 'utf-8',
    privateKey: null,
    publicKey: null
  },
  stripe: {
    publishableKey: isDev ? 'pk_test_98A7TrR0G8W7SyUIdjoQytZj' : 'pk_live_5a1IQUuynng65TjcwmnGQkvY'
  },
  github: {
    blockchainUrl,
    blockchainSearchUrl: blockchainUrl + '/search?q=',
    blockchainDownloadUrl: blockchainUrl + '/archive/master.zip'
  }
}

config.initKeys = async () => {
  const keyPair = await crypto.subtle.generateKey({name: 'ECDSA', namedCurve: 'P-256'}, false, ['sign', 'verify'])
  config.crypto.privateKey = keyPair.privateKey
  config.crypto.publicKey = keyPair.publicKey
}

export default config
