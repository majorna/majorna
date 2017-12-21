import React, { Component } from 'react';
import { FirebaseAuth } from 'react-firebaseui';
import firebase from 'firebase';

export default class Register extends Component {
  constructor () {
    super();

    // initialize Firebase
    const config = {
      apiKey: "AIzaSyCxdSFEhrqdH2VJ8N4XmRZ9st5Q5hBmgfY",
      authDomain: "majorna-fire.firebaseapp.com",
      databaseURL: "https://majorna-fire.firebaseio.com",
      projectId: "majorna-fire",
      storageBucket: "majorna-fire.appspot.com",
      messagingSenderId: "526928901295"
    };
    firebase.initializeApp(config);

    // initialize FirebaseUI
    const uiConfig = {
      // Popup signin flow rather than redirect flow.
      signInFlow: 'popup',
      // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
      signInSuccessUrl: '/',
      // We will display Google and Facebook as auth providers.
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
      ]
    };
  }

  handleClick = () => {}

  render() {
    return (
      <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
    );
  }
}
