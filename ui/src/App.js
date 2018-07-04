import React, { Component } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import QRCode from 'qrcode'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'bulma/css/bulma.css'
import './App.css'
import './comps/shared/FontAwesome'
import config from './data/config'
import server from './data/server'
import Navbar from './comps/shared/Navbar'
import Home from './comps/home/Home'
import Login from './comps/home/Login'
import Profile from './comps/account/Profile'
import Shop from './comps/shop/Shop'
import ShopItem from './comps/shop/ShopItem'
import Dashboard from './comps/account/Dashboard'
import Footer from './comps/shared/Footer'
import Send from './comps/account/Send'
import Receive from './comps/account/Receive'
import Mine from './comps/account/Mine'
import About from './comps/about/About'
import Tech from './comps/about/Tech'
import Roadmap from './comps/about/Roadmap'
import PrivateRoute from './comps/shared/PrivateRoute'
import Modal from './comps/shared/Modal'
import Terms from './comps/about/Terms'
import TxDetails from './comps/account/TxDetails'
import testRunner from './blockchain/test-runner'

export default withRouter(class extends Component {
  constructor(props) {
    super(props)
    this.state = this.nullState = {
      notification: null,
      user: null, // firebase auth user
      acctQr: null, // data:image/png;base64,iVBORw0KG.......kJggg==,
      /* firestore docs */
      userDoc: null
    }

    // firebase config
    this.firebaseUIConfig = {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {signInSuccessWithAuthResult: () => false /* don't redirect anywhere */}
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
        authDomain: config.hosting.domain,
        databaseURL: 'https://majorna-fire.firebaseio.com',
        projectId: 'majorna-fire',
        storageBucket: 'majorna-fire.appspot.com',
        messagingSenderId: '526928901295'
      }
    this.firebaseApp = firebase.initializeApp(firebaseConf)

    // initialize firebase sockets
    this.db = this.firebaseApp.firestore()
    this.fbUnsubMjMetaDocSnapshot = this.db.collection('meta').doc('mj').onSnapshot(doc => this.setState({mjMetaDoc: doc.data()}))

    this.firebaseAuth = this.firebaseApp.auth()
    this.firebaseAuth.onAuthStateChanged(async u => {
      if (u) {
        this.props.history.push('/dashboard')
        this.setState({user: u})
        // todo: this.fbUnsubMjMetaDocSnapshot = this.db.collection('meta').doc('mj').onSnapshot(doc => this.setState({mjMetaDoc: doc.data()}))
        this.fbUnsubUserSelfDocSnapshot = this.db.collection('users').doc(u.uid).onSnapshot(async doc => {
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
        config.server.token = await u.getIdToken()
      } else {
        this.setState(this.nullState) // logged out or token expired and was not renewed
        this.props.location.pathname !== '/login' && this.props.history.push('/')
      }
    })

    // ID token expires every 60 mins so renew it every 15 mins not to send expired token to server
    setInterval(async () => {
      // todo: can instead retry fetch after refreshing token instead of doing this every 15 min: https://stackoverflow.com/a/46176314/628273
      if (this.state.user) {
        config.server.token = await this.state.user.getIdToken(true)
        console.log('refreshed firebase auth ID token')
      }
    }, 15 * 60 * 1000)

    // run tests when in dev mode
    if (!config.app.isTest) {
      testRunner()
    }
  }

  logout = async () => {
    // unsub from firestore realtime document updates
    this.fbUnsubUserSelfDocSnapshot && this.fbUnsubUserSelfDocSnapshot()
    // todo: this.fbUnsubMjMetaDocSnapshot && this.fbUnsubMjMetaDocSnapshot()
    await this.firebaseAuth.signOut()
  }

  showNotification = notification => this.setState({notification})
  clearNotification = () => this.setState({notification: null})

  render = () =>
    <React.Fragment>
      <Navbar logout={this.logout} user={this.state.user}/>

      <Modal clearNotification={this.clearNotification}>{this.state.notification}</Modal>

      <Switch>
        <Route exact path='/' render={routeProps => <Home {...routeProps} mjMetaDoc={this.state.mjMetaDoc}/>} />
        <Route path='/about/tech' component={Tech} />
        <Route path='/about/roadmap' component={Roadmap} />
        <Route path='/about/terms' component={Terms} />
        <Route path='/about' component={About} />
        <Route path='/login' render={routeProps => <Login {...routeProps} uiConfig={this.firebaseUIConfig} firebaseAuth={this.firebaseAuth}/>} />
        <Route path='/dashboard' render={routeProps => <Dashboard {...routeProps} user={this.state.user} acctQr={this.state.acctQr} userDoc={this.state.userDoc} mjMetaDoc={this.state.mjMetaDoc}/>} />
        <PrivateRoute path='/profile' render={routeProps => <Profile {...routeProps} user={this.state.user}/>} />
        <PrivateRoute path='/shop/:id' render={routeProps => <ShopItem {...routeProps} mjMetaDoc={this.state.mjMetaDoc} user={this.state.user} showNotification={this.showNotification}/>} />
        <PrivateRoute path='/shop' component={Shop} />
        <PrivateRoute path='/send' render={routeProps => <Send {...routeProps} userDoc={this.state.userDoc}/>} />
        <PrivateRoute path='/receive' render={routeProps => <Receive {...routeProps} user={this.state.user} acctQr={this.state.acctQr}/>} />
        <PrivateRoute path='/mine' render={routeProps => <Mine {...routeProps} db={this.db}/>} />
        <PrivateRoute path='/tx/:id' render={routeProps => <TxDetails {...routeProps} user={this.state.user} userDoc={this.state.userDoc}/>} />
        <Redirect from='*' to='/'/>
      </Switch>

      <Footer/>
    </React.Fragment>
})
