const env = process.env.NODE_ENV || 'development'

exports.app = {
  env,
  isProd: env === 'production',
  isDev: env === 'development',
  isTest: env === 'test',
  isCloudFn: false // if require('firebase-functions').config().firebase is defined
}

exports.firebase = {

}
