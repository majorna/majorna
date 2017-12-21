import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import firebase from 'firebase';
import 'bulma/css/bulma.css';
import './App.css';
import Navbar from './components/Navbar'
import GetStarted from './components/GetStarted'
import Login from './components/Login'

export default class App extends Component {
  constructor() {
    super();
    this.firebaseApp = firebase.initializeApp({
      apiKey: "AIzaSyCxdSFEhrqdH2VJ8N4XmRZ9st5Q5hBmgfY",
      authDomain: "majorna-fire.firebaseapp.com",
      databaseURL: "https://majorna-fire.firebaseio.com",
      projectId: "majorna-fire",
      storageBucket: "majorna-fire.appspot.com",
      messagingSenderId: "526928901295"
    });
    this.firebaseAuth = firebase.auth();
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />

        <Switch>
          <Route exact path='/' component={GetStarted} />
          <Route path='/register' render={routeProps => <Login {...routeProps} firebaseAuth={this.firebaseAuth}/>} />
          <Redirect from='*' to='/'/>
        </Switch>

        <div className="App-footer is-size-6">
          &copy; 2018 Majorna Team &middot; Source code is MIT &middot; <a className="button is-small is-info is-outlined" href="https://github.com/majorna" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </div>
      </React.Fragment>
    );
  }
}
