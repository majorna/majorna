import React, { Component } from 'react';
import 'bulma/css/bulma.css';
import './App.css';
import Navbar from './components/Navbar'
import GetStarted from './components/GetStarted'

export default class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />

        <GetStarted />

        <div className="App-footer is-size-6">
          &copy; 2018 Majorna Team &middot; Source code is MIT &middot; <a className="button is-small is-info is-outlined" href="https://github.com/majorna" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </div>
      </React.Fragment>
    );
  }
}
