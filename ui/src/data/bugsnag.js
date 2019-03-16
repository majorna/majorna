import bugsnag from '@bugsnag/js'
import config from './config'

const bugsnagClient = !config.app.isTest ? bugsnag({
  apiKey: '58d2de70068cdb078c2a00c88f1e8b13',
  autoBreadcrumbs: false,
  autoNotify: false,

  autoCaptureSessions: false,
  collectUserIp: false,
  user: {id: '1234'} // todo: set user ID
}) : {}

// bugsnagClient.notify(new Error('Test error'))
export default bugsnagClient
