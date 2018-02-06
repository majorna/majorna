import React from 'react'
import { FirebaseAuth } from 'react-firebaseui'

export default (props) => (
  <div className="hero is-medium is-light">
    <div className="hero-body has-text-centered">
      <h1 className="title is-size-3">Log in to start using Majorna</h1>
      <FirebaseAuth uiConfig={props.uiConfig} firebaseAuth={props.firebaseAuth}/>
    </div>
  </div>
)