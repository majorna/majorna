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
  crypto: {
    algo: 'SHA256',
    encoding: 'base64', // todo: can use DER encoding for signature and save ~20bytes: https://stackoverflow.com/a/39651457/628273 (or compressed ec sig for further reduction)
    // only for testing and dev
    privateKey: `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIHZ9HWFXtortTsbEOOjPZ6hIMDTiFVWX552YWW5aZHlgoAcGBSuBBAAK
oUQDQgAE2yLEGhHZMiClLt4rHm6Kajo2qsRRQMUW3PqHOBnECvFkwXZstFNGyZD4
SVbeNVCQy7nXERlaQ7Kvt4dgZTp1UA==
-----END EC PRIVATE KEY-----`,
    publicKey: `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE2yLEGhHZMiClLt4rHm6Kajo2qsRRQMUW
3PqHOBnECvFkwXZstFNGyZD4SVbeNVCQy7nXERlaQ7Kvt4dgZTp1UA==
-----END PUBLIC KEY-----`
  },
  stripe: {
    publishableKey: isDev ? 'pk_test_98A7TrR0G8W7SyUIdjoQytZj' : 'pk_live_5a1IQUuynng65TjcwmnGQkvY'
  },
  github: {
    blockUrl: isProd ? 'https://github.com/majorna/blockchain/search?q=' : 'https://github.com/majorna/test-blockchain/search?q='
  }
}
