import React from 'react'
import { Link } from 'react-router-dom'
import mj from '../../res/mj.png'
import StatsWidget from '../shared/StatsWidget'

export default props =>
  <React.Fragment>
    {/* Intro text with "Get Started" button */}
    <div className="hero is-medium is-light">
      <div className="hero-body has-text-centered">
        <h1 className="title is-size-1" style={{marginBottom: '3rem'}}>Send, Receive, and Mine Majorna</h1>
        {/* Upon changing this, match public/index.html#metaDescription */}
        <h2 className="subtitle" style={{marginBottom: '3rem'}}>Simple cryptocurrency, in your browser.</h2>
        <div className="field is-grouped is-grouped-centered">
          <p className="control is-hidden-mobile"><input readOnly className="input is-medium" type="text" placeholder="Starter Balance: mj500" /></p>
          <p className="control"><Link className="button is-medium is-info" to='/login'>Get Started</Link></p>
        </div>
      </div>
    </div>

    {/* Majorna stats from firestore/mj/meta document */}
    {!props.mjMetaDoc ? <div className="mj-box center-all spinner"/> : <StatsWidget mjMetaDoc={props.mjMetaDoc} />}

    {/* Media items with key Majorna facts */}
    <div className="mj-box align-start">
      <img src={mj} width="128" height="128" alt="Majorna"/>
      <div className="flex-column flex-grow-1 m-l-m">
        <div className="is-size-5">Simple Cryptocurrency</div>
        Easy to use digital currency in your browser.
        Log in with your Google, Facebook, or Twitter account to start sending, receiving, and mining Majorna.
        <Link to='/login'>+mj500 balance for new accounts.</Link>
      </div>
    </div>

    <div className="mj-box align-start">
      <i className="flex-order-1 m-l-m fas fa-globe" style={{width: 110, height: 110}}/>
      <div className="flex-column flex-grow-1">
        <div className="is-size-5">Planned Decentralization</div>
        In-browser miner is fully functional.
        Trustless and decentralized peer-to-peer network is a work in progress.
        Until a 1.0 release, all mined blocks are also signed by the Majorna key as a security measure.
        See Roadmap for development goals in About section.
      </div>
    </div>

    <div className="mj-box align-start">
      <i className="fab fa-github" style={{width: 110, height: 110}}/>
      <div className="flex-column flex-grow-1 m-l-m">
        <div className="is-size-5">Open Source</div>
        <span>Easy to understand source code, licensed under MIT, hosted on <a href="https://github.com/majorna" target="_blank" rel="noopener noreferrer">GitHub</a>.</span>
        <span>Transaction logs are hosted at GitHub <a href="https://github.com/majorna/blockchain" target="_blank" rel="noopener noreferrer">blockchain repo</a>. Sender and receiver identities are kept secret.</span>
        <span>Community discussions hosted on <a href="https://www.reddit.com/r/majorna/" target="_blank" rel="noopener noreferrer">Reddit</a>.</span>
      </div>
    </div>

    <div className="mj-box align-start">
      <i className="flex-order-1 m-l-m fas fa-credit-card" style={{width: 110, height: 120}}/>
      <div className="flex-column flex-grow-1">
        <div className="is-size-5">Open Development Model</div>
        Currently all development is funded by donations.
        However Majorna team intents to provide services around the currency, i.e. merchant services, shop, etc.
        The team is also responsible for continuous monitoring and overall safety of the system.
      </div>
    </div>

    <div className="mj-box flex-column center-h">
      Still not decided? <Link to='/login'>Give Majorna a go for free and get +mj500 as starter balance.</Link>
    </div>
  </React.Fragment>
