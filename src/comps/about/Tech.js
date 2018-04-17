import React from 'react'

export default props =>
  <React.Fragment>
    <div className="mj-box flex-column">
      <div className="is-size-5 has-text-centered">Majorna Technology</div>
      <div className="m-t-m">
        Following topics summarise Majorna's technical design and concepts:
      </div>

      <div id="mining" className="is-size-5 has-text-centered m-t-l">Mining</div>
      <div className="m-t-m">
        Mining is a means of solving a cryptographically hard problem utilizing your computers processor(s).
        Mining secures majorna transactions via preventing duplicates, so people cannot spend more money than they have.
        As the mining reward, you get some majorna, which in turn helps distribute the currency to users.
      </div>
    </div>
  </React.Fragment>

// summary (media items)

// details (paragraphs)
// - signed vs mined blocks
// - [signed] = delegated trust as a security measure during ~1st year

// mining
// - after securing network aspect + the reward for it, describe webrtc P2P, browser permanent store for blocks, trimming, etc.