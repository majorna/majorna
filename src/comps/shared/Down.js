import React from 'react'
import config from '../../data/config'

export default () =>
  <div className="mj-box flex-column">
    <div className="is-size-4 center-all">Mainnet is Shutting Down</div>

    <div className="m-t-l">
      This comes as a bitter decision but maintaining the mainnet and making large scale changes while trying not to break things became an awfully exhausting exercise for a one man project.
    </div>

    <div className="m-t-m">
      Due to this, mainnet will be shut down and replaced with testnet (purged routinely) so project can be developed in fast iterations again, without the fear of breaking things.
      <strong> All data, accounts, and blocks in the mainnet will be wiped.</strong>
    </div>

    <div className="m-t-m">
      Once the entirely decentralized network is fully production ready, mainnet will be reinitialized from scratch.
      Hopefully by then, project will have more team members and professional funding.
    </div>

    <div className="m-t-m">
      <strong>All contributions/donations to this point are eligible for refund. </strong>
      To request a refund, reach out to <a href={'mailto:support@' + config.hosting.domain} target="_blank" rel="noopener noreferrer">support@{config.hosting.domain}</a> (cc to getmajorna@gmail.com for extra security) within 30 days (till July 14) using the email associated with your Google account, and provide a link to your Bitcoin transaction as a security measure.
      Any non-refunded donation will be put towards future development.
    </div>

    <div className="content m-t-m">
      Here are some statistics from the project:
      <ul>
        <li>Lines of code: ~50000 (including test code)</li>
        <li>Hours spent: ~1000</li>
        <li>Approximate cost of development: ~100000$</li>
        <li>Donations raised: ~0.44 BTC</li>
      </ul>
    </div>

    <div className="m-t-m">
      Thank you for putting your thoughts into this project.
    </div>
  </div>
