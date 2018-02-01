import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'bulma/css/bulma.css';
import './App.css';
import apiClient from './data/api-client'
import Navbar from './components/Navbar'
import GetStarted from './components/GetStarted'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'

export default withRouter(class App extends Component {
  constructor(props) {
    super(props);
    const env = window.document.URL.includes('http://localhost:3000') ? 'development' : 'production'
    this.state = this.nullState = {
      user: null,
      idToken: null,
      account: null,
      mj: {
        meta: {
          val: null, // usd
          cap: null, // mj
          monthly: null // usd per day, for last 1 month
        }
      }
    };

    // firebase config
    this.firebaseUIConfig = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {signInSuccess: () => false /* don't redirect anywhere */}
    };
    const firebaseConf = env === 'development' ?
      {
        apiKey: 'AIzaSyBFZEhjyZdbZEMpboYZzRRHfIUhvo4VaHQ',
        authDomain: 'majorna-test.firebaseapp.com',
        databaseURL: 'https://majorna-test.firebaseio.com',
        projectId: 'majorna-test',
        storageBucket: 'majorna-test.appspot.com',
        messagingSenderId: '346214163117'
      } :
      {
        apiKey: 'AIzaSyCxdSFEhrqdH2VJ8N4XmRZ9st5Q5hBmgfY',
        authDomain: 'majorna-fire.firebaseapp.com',
        databaseURL: 'https://majorna-fire.firebaseio.com',
        projectId: 'majorna-fire',
        storageBucket: 'majorna-fire.appspot.com',
        messagingSenderId: '526928901295'
      }
    this.firebaseApp = firebase.initializeApp(firebaseConf);

    // initialize firebase sockets
    this.db = this.firebaseApp.firestore();
    this.firebaseAuth = this.firebaseApp.auth();
    this.firebaseAuth.onAuthStateChanged(async u => {
      if (u) {
        this.props.history.push('/dashboard');
        this.setState({user: u});
        this.fbUnsubUsers = this.db.collection('users').doc(u.uid)
          .onSnapshot(doc => {
            if (doc.exists) {
              !doc.metadata.hasPendingWrites && this.setState({account: doc.data()});
            } else {
              apiClient.users.init();
            }
          });
        this.fbUnsubMeta = this.db.collection('mj').doc('meta').onSnapshot(doc => this.setState({mj: {meta: doc.data()}}));
        this.setState({idToken: await u.getIdToken()})
      } else {
        this.setState(this.nullState); // logged out
        this.props.location.pathname !== '/login' && this.props.history.push('/');
      }
    });
  }

  componentDidMount() {
    // start network requests
  }

  logout = async () => {
    this.fbUnsubUsers && this.fbUnsubUsers();
    this.fbUnsubMeta && this.fbUnsubMeta();
    await this.firebaseAuth.signOut()
  };

  render() {
    return (
      <React.Fragment>
        <Navbar logout={this.logout} user={this.state.user}/>

        <Switch>
          <Route exact path='/' component={GetStarted} />
          <Route path='/login' render={routeProps => <Login {...routeProps} uiConfig={this.firebaseUIConfig} firebaseAuth={this.firebaseAuth}/>} />
          <Route path='/dashboard' render={routeProps => <Dashboard {...routeProps} user={this.state.user} account={this.state.account} mj={this.state.mj}/>} />
          <Redirect from='*' to='/'/>
        </Switch>

        <Footer/>
      </React.Fragment>
    );
  }
})
