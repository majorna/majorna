import React from 'react'

export default props =>
  <React.Fragment>
    <div className="mj-box flex-column">
      <div className="is-size-5 has-text-centered">Roadmap</div>
      <div className="m-t-m">
        Following bullets summarise completed and planned tasks:
      </div>

      <div className="content">
        <ul>
          <li>☑ Send & receive support.</li>
          <li>☑ Google auth integration.</li>
          <li>☑ Client-server miner.</li>
          <li>☑ Shop.</li>
          <li>☐ Tech pages.</li>
          <li>☐ Peer-to-peer miner.</li>
          <li>☐ Individual public/private key pairs for users.</li>
          <li>☐ Stats page.</li>
          <li>☐ Funding page.</li>
          <li>☐ Public announcement.</li>
          <li>☐ Mobile apps.</li>
          <li>☐ 3rd party integrations and bots.</li>
          <li>☐ Majorna fund.</li>
        </ul>
      </div>
    </div>
  </React.Fragment>


// roadmap:
// - done (github releases) and to do milestones
// - exchange (in addition to shop where you can also exchange fiat easily without the trading details)
