import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'bulma/css/bulma.css';
import './App.css';
import Navbar from './components/Navbar'
import GetStarted from './components/GetStarted'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'

export default withRouter(class App extends Component {
  constructor(props) {
    super(props);
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
        this.firebaseUser = u;
        props.location.pathname !== '/dashboard' && props.history.push('/dashboard');
      } else {
        this.firebaseUser = null; // logged out
      }
    });
    this.firestore = firebase.firestore();
  }

  logout = async () => await this.firebaseAuth.signOut();

  render() {
    return (
      <React.Fragment>
        <Navbar logout={this.logout}/>

        <Switch>
          <Route exact path='/' component={GetStarted} />
          <Route path='/login' render={routeProps => <Login {...routeProps} uiConfig={this.firebaseUIConfig} firebaseAuth={this.firebaseAuth}/>} />
          <Route path='/dashboard' component={Dashboard} />
          <Redirect from='*' to='/'/>
        </Switch>

        <Footer/>
      </React.Fragment>
    );
  }
})
