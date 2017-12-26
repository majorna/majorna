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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default withRouter(class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.nullState = {
      user: null,
      account: null
    };
    this.firebaseUIConfig = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {signInSuccess: () => false}
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
        !this.state.user && this.setState({user: u});
        props.location.pathname !== '/dashboard' && props.history.push('/dashboard');
        !this.state.account && this.setState({account: await this.readFirestoreDoc(this.db.collection('users').doc(u.uid))});
      } else {
        this.setState(this.nullState); // logged out
      }
    });
  }

  logout = async () => await this.firebaseAuth.signOut();
  readFirestoreDoc = async (docRef) => {
    let doc = await docRef.get();
    while (!doc.exists) {
      await sleep(2000);
      doc = await docRef.get();
    }
    return doc.data()
  }

  render() {
    return (
      <React.Fragment>
        <Navbar logout={this.logout} user={this.state.user}/>

        <Switch>
          <Route exact path='/' component={GetStarted} />
          <Route path='/login' render={routeProps => <Login {...routeProps} uiConfig={this.firebaseUIConfig} firebaseAuth={this.firebaseAuth}/>} />
          <Route path='/dashboard' render={routeProps => <Dashboard {...routeProps} user={this.state.user} account={this.state.account} />} />
          <Redirect from='*' to='/'/>
        </Switch>

        <Footer/>
      </React.Fragment>
    );
  }
})
