import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
  <div className="mj-box flex-column">
    <div className="is-size-5 has-text-centered">About Majorna</div>
    <div className="m-t-m">
      Majorna (mj) is an easy to use cryptocurrency.
      It is available in browser, without any need for special software.
      All transaction logs are kept at GitHub <a href="https://github.com/majorna/blockchain" target="_blank" rel="noopener noreferrer">blockchain repo</a>.
      All transaction are transparent and logs are publicly accessible, whereas sender and receiver identities are anonymous.
      This makes your transactions provable, while keeping your identity hidden (there are also plans to make transactions themselves anonymous).
    </div>

    <strong className="m-t-m">Why Cryptocurrency</strong>
    <div>
      Majorna is a cryptocurrency that works both with delegated trust (for scalability) and with a decentralized and trustless peer-to-peer network.
      Being a <a href="https://en.wikipedia.org/wiki/Cryptocurrency" target="_blank" rel="noopener noreferrer">cryptocurrency</a> means your assets does not need to be stored physically; it is a digitally signed information.
      Being decentralized means that your account does not belong to an institution, all account information is duplicated across the globe, and you hold the key.
      Via memorizing your private key, you can have all your assets, in your memory!
      And only you can spend it using your private key.
    </div>

    <strong className="m-t-m">Why Majorna</strong>
    <div>
      Ease of use is a key to becoming a publicly accepted cryptocurrency.
      Majorna prioritizes simplicity and ease of use via an "all in your browser" approach.
    </div>

    <strong className="m-t-m">Majorna Supply</strong>
    <div>
      Max Majorna supply allocated for public distribution is denoted on the front page (this is subject to change).
      Current Majorna supply denotes the currently distributed amount.
    </div>

    <div className="content m-t-m">
      Following are work-in-progress documents detailing Majorna:
      <ul>
        <li><Link to="/about/tech">Majorna Technology</Link></li>
        <li><Link to="/about/roadmap">Roadmap</Link></li>
        <li><a href="https://github.com/orgs/majorna/people" target="_blank" rel="noopener noreferrer">Team</a></li>
        <li><Link to="/about/terms">Terms and Conditions</Link></li>
      </ul>
    </div>
  </div>


// # majorna
// - link to roadmap
// - link to tech
// - intro (what it is & goals)
// - link to tech page for details)

// ## why majorna
// - ease of use (no download required, browser only, one click signup)
// - amazingly simple in comparison to other cryptos with key generation etc. all on user, which can all go wrong
// - optional opt-in for many advanced features (i.e. own private keys etc.)

// ## the team

// ## the vision
// - long term goals (and link to roadmap complete with time goals)
// - plan to be a globally accepted payment platform & currency
