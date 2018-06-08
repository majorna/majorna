import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
  <div className="mj-box flex-column">
    <Link to="/about">{'< About'}</Link>

    <div className="is-size-5 has-text-centered">Roadmap</div>
    <div className="m-t-m">
      Following bullets summarize completed and planned tasks:
    </div>

    <div className="content">
      <ul>
        <li>☑ Send & receive support.</li>
        <li>☑ Google auth integration.</li>
        <li>☑ Miner.</li>
        <li>☑ Shop.</li>
        <li>☑ Coinbase Commerce integration.</li>
        <li>☐ Peer-to-peer decentralized network.</li>
        <li>☐ Individual public/private key pairs for users.</li>
        <li>☐ GPU miner.</li>
        <li>☐ Stats page.</li>
        <li>☐ Blockchain explorer.</li>
        <li>☐ Payment services (hosted payment page, widget, button).</li>
        <li>☐ 3rd party integrations and bots.</li>
        <li>☐ Exchange.</li>
        <li>☐ Mobile apps.</li>
        <li>☐ Shop/Merchant SDK.</li>
        <li>☐ Public announcement.</li>
        <li>☐ After all mj supply is distributed: transition to proof-of-stake, delegate trust, or another consensus algorithm.</li>
      </ul>
    </div>
  </div>
