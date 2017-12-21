import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import firebase from 'firebase';
import { FirebaseAuth } from 'react-firebaseui';
import 'bulma/css/bulma.css';
import './App.css';
import Navbar from './components/Navbar'
import GetStarted from './components/GetStarted'

export default class App extends Component {
  constructor() {
    super();
    this.firebaseUIConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ]
    };
    this.firebaseApp = firebase.initializeApp({
      apiKey: "AIzaSyCxdSFEhrqdH2VJ8N4XmRZ9st5Q5hBmgfY",
      authDomain: "majorna-fire.firebaseapp.com",
      databaseURL: "https://majorna-fire.firebaseio.com",
      projectId: "majorna-fire",
      storageBucket: "majorna-fire.appspot.com",
      messagingSenderId: "526928901295"
    });
    this.firebaseAuth = firebase.auth();
    this.firebaseAuth.onAuthStateChanged(u => {
      if (u) {
        this.firebaseUser = u
      }
    });
  }

  logout = async () => {
    try {
      await this.firebaseAuth.signOut();
    } catch (e) {

    }
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />

        <Switch>
          <Route exact path='/' component={GetStarted} />
          <Route path='/login' render={routeProps => <FirebaseAuth {...routeProps} uiConfig={this.firebaseUIConfig} firebaseAuth={this.firebaseAuth}/>} />
          <Redirect from='*' to='/'/>
        </Switch>

        <div className="App-footer is-size-6">
          &copy; 2018 Majorna Team &middot; Source code is MIT &middot; <a className="button is-small is-info is-outlined" href="https://github.com/majorna" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </div>
      </React.Fragment>
    );
  }
}
