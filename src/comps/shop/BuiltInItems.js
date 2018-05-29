import React from 'react'
import { Link } from 'react-router-dom'
import mj from '../../res/mj.png'
import ExchangeRatesWidget from '../shared/ExchangeRatesWidget'
import server from '../../data/server'
import config from '../../data/config'

export default [
  {
    id: 'majorna',
    name: 'Majorna',
    description: () => <React.Fragment>
      Donate to Majorna development using Bitcoin or Ethereum: all donors receive matching amount of majorna in their accounts within 30 minutes as a token of gratitude.
      Majorna currently has no inherent value, and may or may not have any value in the future, so keep that in mind.
      Via using Majorna, you agree to the <Link to="/about/terms">Terms and Conditions</Link>.
      All donations are final and non-refundable.
      You can report problems about donations to <a href={'mailto:support@' + config.hosting.domain} target="_blank" rel="noopener noreferrer">support@{config.hosting.domain}</a>.
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
    coinbaseUrlFn: server.shop.getCoinbaseCommerceChargeUrl,
    widget: ExchangeRatesWidget
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    unavailable: true,
    description: 'Get Bitcoin using your Majorna balance.',
    fontIcon: 'fab fa-bitcoin'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    unavailable: true,
    description: 'Get Ethereum using your Majorna balance.',
    fontIcon: 'fab fa-ethereum'
  },
  {
    id: 'usdollar',
    name: 'US Dollar',
    unavailable: true,
    description: 'Get US Dollar using your Majorna balance.',
    fontIcon: 'fas fa-dollar-sign'
  },
  {
    id: 'euro',
    name: 'Euro',
    unavailable: true,
    description: 'Get Euro using your Majorna balance.',
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
