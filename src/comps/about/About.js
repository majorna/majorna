import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
  <React.Fragment>
    <div className="mj-box flex-column">
      <div className="is-size-5 has-text-centered">About Majorna</div>
      <div className="m-t-m">
        Majorna is an easy to use cryptocurrency.
        It is available in browser, without any need for special software.
        Following are work-in-progress documents detailing Majorna:
      </div>

      <div className="content">
        <ul className="m-t-l">
          <li><Link to="/about/tech">Majorna Technology</Link></li>
          <li><Link to="/about/roadmap">Roadmap</Link></li>
        </ul>
      </div>
    </div>
  </React.Fragment>


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