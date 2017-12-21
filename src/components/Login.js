import React, { Component } from 'react';
import { FirebaseAuth } from 'react-firebaseui';
import firebase from 'firebase';

export default class Login extends Component {
  firebaseUIConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  };

  render() {
    return (
      <FirebaseAuth uiConfig={this.firebaseUIConfig} firebaseAuth={this.props.firebaseAuth}/>
    );
  }
}
