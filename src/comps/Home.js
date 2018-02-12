import React from 'react'
import { Link } from 'react-router-dom'

export default () => (
  <React.Fragment>
    {/* Intro text with "Get Started" button */}
    <div className="hero is-medium is-light">
      <div className="hero-body has-text-centered">
        <h1 className="title is-size-1" style={{marginBottom: '3rem'}}>Send and Receive Majorna</h1>
        <h2 className="subtitle" style={{marginBottom: '3rem'}}>Simple cryptocurrency, in your browser.</h2>
        <div className="field is-grouped is-grouped-centered">
          <p className="control is-hidden-mobile"><input readOnly className="input is-medium" type="text" placeholder="Starter Balance: 500mj" /></p>
          <p className="control"><Link className="button is-medium is-info" to='/login'>Get Started</Link></p>
        </div>
      </div>
    </div>

    {/* Majorna stats from firestore/mj/meta document */}
    <div className="mj-box">Some Stats</div>

    {/* Media items with key Majorna facts */}
    <div className="mj-box align-start">
      <img src="http://via.placeholder.com/128x128" alt=""/>
      <div className="flex-column flex-grow-1 m-l-m">
        <div className="is-size-5">Simple Cryptocurrency</div>
        Easy to use cryptocurrency in your browser.
        Log in with your Google, Facebook, or Twitter account to start sending and receiving Majorna.
        <Link to='/login'>+mj500 balance for all new accounts in 2018.</Link>
      </div>
    </div>

    <div className="mj-box align-start">
      <img className="flex-order-1 m-l-m" src="http://via.placeholder.com/128x128" alt=""/>
      <div className="flex-column flex-grow-1">
        <div className="is-size-5">Decentralized and Scalable</div>
        Trustless and decentralized with simple in-browser miner.
        Peer-to-peer payments without a central authority.
        Horizontal scalability through delegated trust.
      </div>
    </div>

    <div className="mj-box align-start">
      <img src="http://via.placeholder.com/128x128" alt=""/>
      <div className="flex-column flex-grow-1 m-l-m">
        <div className="is-size-5">Open Source</div>
        <span>Easy to understand source code, licensed under MIT, hosted on <a href="https://github.com/majorna" target="_blank" rel="noopener noreferrer">GitHub</a>.</span>
        <span>Transaction logs are hosted at GitHub <a href="https://github.com/majorna/blockchain" target="_blank" rel="noopener noreferrer">blockchain repo</a>. Sender and receiver identities are kept secret.</span>
        <span>Community discussions hosted on <a href="https://www.reddit.com/r/majorna/" target="_blank" rel="noopener noreferrer">Reddit</a>.</span>
      </div>
    </div>

    <div className="mj-box align-start">
      <img className="flex-order-1 m-l-m" src="http://via.placeholder.com/128x128" alt=""/>
      <div className="flex-column flex-grow-1">
        <div className="is-size-5">Open Business Model</div>
        Majorna team intents to fund development via providing services around the cryptocurrency, as well as through the initial distribution of the currency.
        25% of the Majorna funds are planned to be allocated for Majorna fund, to stabilize the market during initial years.
      </div>
    </div>

    <div className="mj-box flex-column center-h">
      Still not decided? <Link to='/login'>Give Majorna a go for free and get +mj500 as starter balance.</Link>
    </div>
  </React.Fragment>
)