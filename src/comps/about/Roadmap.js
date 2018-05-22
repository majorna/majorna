import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
  <div className="mj-box flex-column">
    <Link to="/about">{'< About'}</Link>

    <div className="is-size-5 has-text-centered">Roadmap</div>
    <div className="m-t-m">
      Following bullets summarise completed and planned tasks:
    </div>

    <div className="content">
      <ul>
        <li>☑ Send & receive support.</li>
        <li>☑ Google auth integration.</li>
        <li>☑ Miner.</li>
        <li>☑ Shop.</li>
        <li>☑ Coinbase Commerce and Stripe integration.</li>
        <li>☐ Peer-to-peer network (using WebRTC).</li>
        <li>☐ Individual public/private key pairs for users.</li>
        <li>☐ Tech pages.</li>
        <li>☐ Stats page.</li>
        <li>☐ Funding page.</li>
        <li>☐ Public announcement.</li>
        <li>☐ Exchange.</li>
        <li>☐ Mobile apps.</li>
        <li>☐ Shop/Merchant SDK.</li>
        <li>☐ 3rd party integrations and bots.</li>
        <li>☐ Payment services.</li>
        <li>☐ Majorna fund.</li>
      </ul>
    </div>
  </div>
