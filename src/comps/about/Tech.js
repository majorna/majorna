import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
  <div className="mj-box flex-column">
    <Link to="/about">{'< About'}</Link>

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

    <div id="mining" className="is-size-5 has-text-centered m-t-l">Node/Web Technologies Used</div>
    <div className="m-t-m">
      Mining is a means of solving a cryptographically hard problem utilizing your computers processor(s).
      Mining secures majorna transactions via preventing duplicates, so people cannot spend more money than they have.
      As the mining reward, you get some majorna, which in turn helps distribute the currency to users.
    </div>

    <div id="mining" className="is-size-5 has-text-centered m-t-l">Cryptographic Algorithms Used</div>
    <ul className="m-t-m">
      <li>Account public/private key pairs: Elliptic Curve DSA using SECP256K1 curve.</li>
      <li>Transaction signature: ECDSA with SHA256.</li>
      <li>Transaction/merkle tree hash: SHA256.</li>
      <li>Block/miner hash: SHA256.</li>
    </ul>
  </div>


// summary (media items)

// details (paragraphs)
// - signed vs mined blocks
// - [signed] = delegated trust as a security measure during ~1st year

// mining
// - after securing network aspect + the reward for it, describe webrtc P2P, browser permanent store for blocks, trimming, etc.