import React from 'react'
import mj from '../../res/mj.png'
import ExchangeRatesWidget from '../shared/ExchangeRatesWidget'
import server from '../../data/server'
import config from '../../data/config'

export default [
  // {
  //   id: 'donate',
  //   name: 'Donate',
  //   description: () => <React.Fragment>
  //     Contribute to Majorna development using Bitcoin, Ethereum, or other cryptos.
  //     Donations are anonymous and non-refundable.
  //     They are appreciated but never asked.
  //     All donations are private (hence a tax-related donation receipt can not be issued) and have no rights or privileges associated with them.
  //     Thank you for supporting us on our journey to become a publicly accepted payment platform and a cryptocurrency.
  //   </React.Fragment>,
  //   imageUrl: mj,
  //   coinbaseUrl: 'https://commerce.coinbase.com/checkout/3e67bb92-c9e8-42c3-a832-48f8bfc67e84'
  // },
  {
    id: 'majorna',
    name: 'Buy Majorna',
    unavailable: true,
    description: () => <React.Fragment>
      Buy Majorna using Bitcoin, Ethereum, or other cryptos.
      Amount sent will be converted to mj and deposited in your account within 15 minutes.
      You can report problems about purchases to <a href={'mailto:support@' + config.hosting.domain} target="_blank" rel="noopener noreferrer">support@{config.hosting.domain}</a>
    </React.Fragment>,
    imageUrl: mj,
    // stripeScriptUrl: 'https://js.stripe.com/v3/',
    // stripeCheckoutScriptUrl: 'https://checkout.stripe.com/checkout.js',
    // stripeConfig: {
    //   name: 'Majorna',
    //   description: 'Donate to Majorna using card (via Stripe).',
    //   currency: 'usd',
    //   allowRememberMe: false,
    //   amount: 0
    // },
    widget: ExchangeRatesWidget,
    coinbaseUrlFn: server.shop.getCoinbaseCommerceChargeUrl
  },
  {
    id: 'bitcoin',
    name: 'Buy Bitcoin',
    unavailable: true,
    description: 'Buy Bitcoin using your Majorna balance.',
    fontIcon: 'fab fa-bitcoin',
    widget: ExchangeRatesWidget
  },
  {
    id: 'ethereum',
    name: 'Buy Ethereum',
    unavailable: true,
    description: 'Buy Ethereum using your Majorna balance.',
    fontIcon: 'fab fa-ethereum',
    widget: ExchangeRatesWidget
  },
  {
    id: 'usdollar',
    name: 'Buy US Dollar',
    unavailable: true,
    description: 'Buy US Dollar using your Majorna balance.',
    fontIcon: 'fas fa-dollar-sign',
    widget: ExchangeRatesWidget
  },
  {
    id: 'euro',
    name: 'Buy Euro',
    unavailable: true,
    description: 'Buy Euro using your Majorna balance.',
    fontIcon: 'fas fa-euro-sign',
    widget: ExchangeRatesWidget
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
    name: 'Get Crowner',
    unavailable: true,
    description: 'Choose your own adventure: rule your kingdom of prosperity... or ruins. Click on Google Play icon for game details.',
    imageUrl: 'https://lh3.googleusercontent.com/A8TzrOKsyHUWTEg0-2Qr6aFLvWhCJUq37M4E_BC3qB9JXAjxTnu4GXel3sSa-ysnx_cz=s360',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.soygul.crowner'
  }
]
