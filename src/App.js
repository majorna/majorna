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
              <a className="navbar-item">Accounts</a>
              <div className="navbar-item has-dropdown">
                <a className="navbar-link">Profile</a>
                <div className="navbar-dropdown is-boxed is-right">
                  <a className="navbar-item">Settings</a>
                  <a className="navbar-item">Logout</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero is-medium is-light">
          <div className="hero-body has-text-centered">
            <h1 className="title">Send and Receive Majorna</h1>
            <h2 className="subtitle">Simple crypto currency with built-in banking services.</h2>
            <a className="button is-medium is-info">Get Started</a>
          </div>
        </div>

        <div className="App-footer is-size-6">
          &copy; 2018 Majorna Team &middot; Source code is MIT licensed &middot; <a className="button is-small is-info is-outlined" href="https://github.com/majorna" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
