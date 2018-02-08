import React, { Component } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import QRCode from 'qrcode'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'bulma/css/bulma.css'
import './App.css'
import config from './data/config'
import server from './data/server'
import Navbar from './components/Navbar'
import GetStarted from './components/GetStarted'
import Login from './components/Login'
import Dashboard from './components/account/Dashboard'
import Footer from './components/Footer'
import Send from './components/account/Send'
import Receive from './components/account/Receive'

export default withRouter(class App extends Component {
  constructor(props) {
    super(props)
    this.state = this.nullState = {
      user: null, // firebase auth user
      acctQr: null, // data:image/png;base64,iVBORw0KG.......kJggg==,

      // firestore docs:
      userDoc: null,
      mj: {
        meta: {
          val: null, // usd
          cap: null, // mj
          monthly: null // usd per day, for last 1 month
        }
      }
    }

    // firebase config
    this.firebaseUIConfig = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {signInSuccess: () => false /* don't redirect anywhere */}
    }
    if (config.app.isDev) {
      this.firebaseUIConfig.signInOptions.push(firebase.auth.EmailAuthProvider.PROVIDER_ID)
      this.firebaseUIConfig.credentialHelper = 'none'
    }
    const firebaseConf = config.app.isDev ?
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
    this.firebaseApp = firebase.initializeApp(firebaseConf)

    // initialize firebase sockets
    this.db = this.firebaseApp.firestore()
    this.firebaseAuth = this.firebaseApp.auth()
    this.firebaseAuth.onAuthStateChanged(async u => {
      if (u) {
        this.props.history.push('/dashboard')
        this.setState({user: u})
        this.fbUnsubUsers = this.db.collection('users').doc(u.uid).onSnapshot(async doc => {
            if (doc.exists) {
              const userData = doc.data()
              !doc.metadata.hasPendingWrites && this.setState({userDoc: userData})
              this.setState({acctQr: await QRCode.toDataURL(
                [{data: `majorna:${userData.uid}`, mode: 'byte'}],
                {errorCorrectionLevel: 'H', margin: 1, scale: 8})})
            } else {
              // id token might still be null at this point
              if (!config.server.token) config.server.token = await u.getIdToken()
              await server.users.init()
            }
          })
        this.fbUnsubMeta = this.db.collection('mj').doc('meta').onSnapshot(doc => this.setState({mj: {meta: doc.data()}}))
        config.server.token = await u.getIdToken()
      } else {
        this.setState(this.nullState) // logged out
        this.props.location.pathname !== '/login' && this.props.history.push('/')
      }
    })
  }

  componentDidMount() {
    // start network requests
  }

  logout = async () => {
    this.fbUnsubUsers && this.fbUnsubUsers()
    this.fbUnsubMeta && this.fbUnsubMeta()
    await this.firebaseAuth.signOut()
  }

  render() {
    return (
      <React.Fragment>
        <Navbar logout={this.logout} user={this.state.user}/>

        <Switch>
          <Route exact path='/' component={GetStarted} />
          <Route path='/login' render={routeProps => <Login {...routeProps} uiConfig={this.firebaseUIConfig} firebaseAuth={this.firebaseAuth}/>} />
          <Route path='/dashboard' render={routeProps => <Dashboard {...routeProps} user={this.state.user} acctQr={this.state.acctQr} userDoc={this.state.userDoc} mj={this.state.mj}/>} />
          <Route path='/send' render={routeProps => <Send {...routeProps} userDoc={this.state.userDoc}/>} />
          <Route path='/receive' render={routeProps => <Receive {...routeProps} user={this.state.user} acctQr={this.state.acctQr}/>} />
          <Redirect from='*' to='/'/>
        </Switch>

        <Footer/>
      </React.Fragment>
    )
  }
})
