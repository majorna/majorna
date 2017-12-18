import React, { Component } from 'react';
import 'bulma/css/bulma.css';
import './App.css';
import logo from './res/majorna.png';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="navbar">
          <div className="navbar-brand">
            <a className="navbar-item" href="/"><img src={logo} alt="Majorna"/></a>
            <div className="navbar-burger"><span/><span/><span/></div>
          </div>
          <div className="navbar-menu">
            <div className="navbar-end">
              <a className="navbar-item is-active">Accounts</a>
              <a className="navbar-item">Profile</a>
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Right</a>
                <div className="navbar-dropdown is-boxed is-right">
                  <a className="navbar-item">Overview</a>
                  <a className="navbar-item">Elements</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero is-medium is-light">
          <div className="hero-body">
            <div className="container has-text-centered">
              <h1 className="title">
                Primary bold title
              </h1>
              <h2 className="subtitle">
                Primary bold subtitle
              </h2>
              <a className="button is-medium is-info">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
