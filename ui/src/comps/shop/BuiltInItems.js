import React from 'react'
import mj from '../../res/mj.png'

export default [
  {
    id: 'majorna',
    name: 'Donate',
    description: () => <React.Fragment>
      Contribute to Majorna development using Bitcoin, Ethereum, or other cryptos.
      Donations are anonymous and non-refundable.
      They are appreciated but never asked.
      All donations are private (hence a tax-related donation receipt can not be issued) and have no rights or privileges associated with them.
      <strong> You will NOT get Majorna for donations</strong>, but you can always mine it.
      Thank you for supporting us on our journey to become a publicly accepted payment platform and a cryptocurrency.
    </React.Fragment>,
    imageUrl: mj,
    // stripeScriptUrl: 'https://js.stripe.com/v3/',
    stripeCheckoutScriptUrl: 'https://checkout.stripe.com/checkout.js',
    stripeConfig: {
      name: 'Majorna',
      description: 'Donate to Majorna using card (via Stripe).',
      currency: 'usd',
      allowRememberMe: false,
      amount: 0
    },
    // widget: ExchangeRatesWidget,
    // coinbaseUrlFn: server.shop.getCoinbaseCommerceChargeUrl
    coinbaseUrl: 'https://commerce.coinbase.com/checkout/3e67bb92-c9e8-42c3-a832-48f8bfc67e84'
  },
  // {
  //   id: 'bitcoin',
  //   name: 'Bitcoin',
  //   unavailable: true,
  //   description: 'Get Bitcoin using your Majorna balance.',
  //   fontIcon: 'fab fa-bitcoin'
  // },
  // {
  //   id: 'ethereum',
  //   name: 'Ethereum',
  //   unavailable: true,
  //   description: 'Get Ethereum using your Majorna balance.',
  //   fontIcon: 'fab fa-ethereum'
  // },
  // {
  //   id: 'usdollar',
  //   name: 'US Dollar',
  //   unavailable: true,
  //   description: 'Get US Dollar using your Majorna balance.',
  //   fontIcon: 'fas fa-dollar-sign'
  // },
  // {
  //   id: 'euro',
  //   name: 'Euro',
  //   unavailable: true,
  //   description: 'Get Euro using your Majorna balance.',
  //   fontIcon: 'fas fa-euro-sign'
  // },
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
