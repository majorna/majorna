import mj from '../../res/mj.png'

export default [
  {
    id: 'majorna',
    name: 'Majorna',
    description: 'Buy Majorna using Bitcoin, Ethereum, or other cryptos. Amount sent will be converted to mj and deposited in your account, based on the current exchange rate. You can report problems about purchases to support@getmajorna.com or on Majorna Reddit page.',
    imageUrl: mj,
    externalScript: 'https://commerce.coinbase.com/v1/checkout.js', // coinbase script expects to be executed in the same container with the 'Buy' button
    externalUrl: 'https://commerce.coinbase.com/checkout/3e67bb92-c9e8-42c3-a832-48f8bfc67e84',
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    unavailable: true,
    description: 'Buy Bitcoin using your Majorna balance.',
    fontIcon: 'fab fa-bitcoin'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    unavailable: true,
    description: 'Buy Ethereum using your Majorna balance.',
    fontIcon: 'fab fa-ethereum'
  },
  {
    id: 'usdollar',
    name: 'US Dollar',
    unavailable: true,
    description: 'Buy US Dollar using your Majorna balance.',
    fontIcon: 'fas fa-dollar-sign'
  },
  {
    id: 'euro',
    name: 'Euro',
    unavailable: true,
    description: 'Buy Euro using your Majorna balance.',
    fontIcon: 'fas fa-euro-sign'
  },
  {
    id: 'reddit',
    name: 'Send to Reddit',
    unavailable: true,
    description: 'Send Majorna to a Reddit comment or post author.',
    fontIcon: 'fab fa-reddit'
  },
  {
    id: 'crowner',
    name: 'Crowner',
    unavailable: true,
    description: 'Choose your own adventure: rule your kingdom of prosperity... or ruins. Click on Google Play icon for game details.',
    imageUrl: 'https://lh3.googleusercontent.com/A8TzrOKsyHUWTEg0-2Qr6aFLvWhCJUq37M4E_BC3qB9JXAjxTnu4GXel3sSa-ysnx_cz=s360',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.soygul.crowner'
  },
]
