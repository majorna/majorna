import React, { Component } from 'react';
import 'bulma/css/bulma.css';
import './App.css';
import Header from './components/Header'

export default class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />

        <div className="hero is-medium is-light">
          <div className="hero-body has-text-centered">
            <h1 className="is-size-1">Send and Receive Majorna</h1>
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
