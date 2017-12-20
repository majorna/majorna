import React, { Component } from 'react';
import 'bulma/css/bulma.css';
import './App.css';
import Navbar from './components/Navbar'

export default class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />

        <div className="hero is-medium is-light">
          <div className="hero-body has-text-centered">
            <h1 className="title is-size-1" style={{marginBottom: '3rem'}}>Send and Receive Majorna</h1>
            <h2 className="subtitle" style={{marginBottom: '3rem'}}>Simple crypto currency with built-in services.</h2>
            <div className="field is-grouped is-grouped-centered">
              <p className="control"><input className="input is-medium is-hidden-mobile" type="text" placeholder="Enter your email" /></p>
              <p className="control"><a className="button is-medium is-info">Get Started</a></p>
            </div>
          </div>
        </div>

        <div className="App-footer is-size-6">
          &copy; 2018 Majorna Team &middot; Source code is MIT &middot; <a className="button is-small is-info is-outlined" href="https://github.com/majorna" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </div>
      </React.Fragment>
    );
  }
}
