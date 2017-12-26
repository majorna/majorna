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
    this.state = {
      user: null,
      userDb: null
    };
    this.firebaseUIConfig = {
      signInSuccessUrl: '/dashboard',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {signInSuccess: u => (this.setState({user: u}))}
    };
    this.firebaseApp = firebase.initializeApp({
      apiKey: "AIzaSyCxdSFEhrqdH2VJ8N4XmRZ9st5Q5hBmgfY",
      authDomain: "majorna-fire.firebaseapp.com",
      databaseURL: "https://majorna-fire.firebaseio.com",
      projectId: "majorna-fire",
      storageBucket: "majorna-fire.appspot.com",
      messagingSenderId: "526928901295"
    });
    this.db = this.firebaseApp.firestore();
    this.firebaseAuth = this.firebaseApp.auth();
    this.firebaseAuth.onAuthStateChanged(async u => {
      if (u) {
        const userDb = await this.db.collection('users').doc(u.uid).get();
        this.setState({
          user: u,
          userDb: userDb
        });
        props.location.pathname !== '/dashboard' && props.history.push('/dashboard');
      } else {
        this.setState({user: null}); // logged out
      }
    });
  }

  logout = async () => await this.firebaseAuth.signOut();

  render() {
    return (
      <React.Fragment>
        <Navbar logout={this.logout} user={this.state.user}/>

        <Switch>
          <Route exact path='/' component={GetStarted} />
          <Route path='/login' render={routeProps => <Login {...routeProps} uiConfig={this.firebaseUIConfig} firebaseAuth={this.firebaseAuth}/>} />
          <Route path='/dashboard' render={routeProps => <Dashboard {...routeProps} user={this.state.user} userDb={this.state.userDb} />} />
          <Redirect from='*' to='/'/>
        </Switch>

        <Footer/>
      </React.Fragment>
    );
  }
})
