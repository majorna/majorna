import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
  <div className="mj-box flex-column">
    <Link to="/about">{'< About'}</Link>

    <div className="is-size-5 has-text-centered">Majorna Technology</div>
    <div className="m-t-m">
      Following topics summarize Majorna's technical design and concepts:
    </div>

    <strong id="mining" className="m-t-m">Mining</strong>
    <div>
      Mining is a means of solving a cryptographically hard problem utilizing your computers processor(s).
      Mining secures majorna transactions via preventing duplicates, so people cannot spend more than they have.
      As the mining reward, you get some majorna, which in turn helps distribute the currency to users.
    </div>

    <strong id="web-tech" className="m-t-m">Web Technologies Used</strong>
    <ul>
      <li>Signing/mining in browser using <a href="https://en.wikipedia.org/wiki/Web_cryptography_API" target="_blank" rel="noopener noreferrer">Web Crypto API</a>.</li>
      <li>Nodes peer-to-peer connectivity using <a href="https://en.wikipedia.org/wiki/WebRTC" target="_blank" rel="noopener noreferrer">WebRTC</a>.</li>
      <li>Until P2P API is production ready, all miners trust all blocks signed by main Majorna key as a means of delegated trust.</li>
    </ul>

    <strong id="crpto-algos" className="m-t-m">Cryptographic Algorithms Used</strong>
    <ul>
      <li>Account public/private key pairs: Elliptic Curve DSA using SECP256K1 curve.</li>
      <li>Transaction signature: ECDSA with SHA256.</li>
      <li>Transaction (merkle tree) hash: SHA256.</li>
      <li>Block (miner) hash: SHA256.</li>
      <li>Transition to GPU mining in browser using SHA3 is in works.</li>
      <li>Transition to proof-of-stake or delegated trust algorithm after all currency distribution is done is planned.</li>
    </ul>

    <strong id="blockchain-params" className="m-t-m">Blockchain Parameters</strong>
    <ul>
      <li>Block time: ~10 minutes. Can vary during development.</li>
      <li>Block reward: 1mj per block difficulty level. There is a planned algorithm to increase block reward in line with the network's hash rate.</li>
      <li>
        Miner memory requirement: ~2MB.
        This can be varied for further ASIC resistance.
        There is ongoing work to make miner most efficient using fast access memory (i.e. CPU L2/L3 cache).
      </li>
    </ul>
  </div>
