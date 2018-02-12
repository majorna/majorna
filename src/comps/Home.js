import React from 'react'
import { Link } from 'react-router-dom'

export default () => (
  <React.Fragment>
    {/* Intro text with "Get Started" button */}
    <div className="hero is-medium is-light">
      <div className="hero-body has-text-centered">
        <h1 className="title is-size-1" style={{marginBottom: '3rem'}}>Send and Receive Majorna</h1>
        <h2 className="subtitle" style={{marginBottom: '3rem'}}>Simple cryptocurrency, in your browser.</h2>
        <div className="field is-grouped is-grouped-centered">
          <p className="control is-hidden-mobile"><input readOnly className="input is-medium" type="text" placeholder="Starter Balance: 500mj" /></p>
          <p className="control"><Link className="button is-medium is-info" to='/login'>Get Started</Link></p>
        </div>
      </div>
    </div>

    {/* Majorna stats from firestore/mj/meta document */}
    <div className="mj-box">Some Stats</div>

    {/* Media items with key Majorna facts */}
    <div className="mj-box align-start">
      <img src="http://via.placeholder.com/128x128" alt=""/>
      <div className="flex-column flex-grow-1 m-l-m">
        <div className="is-size-5">Media Title</div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        In erat mauris, faucibus quis pharetra sit amet, pretium ac libero.
        Etiam vehicula eleifend bibendum.
      </div>
    </div>

    <div className="mj-box align-start">
      <img className="flex-order-1 m-l-m" src="http://via.placeholder.com/128x128" alt=""/>
      <div className="flex-column flex-grow-1">
        <div className="is-size-5">Media Title</div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        In erat mauris, faucibus quis pharetra sit amet, pretium ac libero.
        Etiam vehicula eleifend bibendum.
      </div>
    </div>

    <div className="mj-box align-start">
      <img src="http://via.placeholder.com/128x128" alt=""/>
      <div className="flex-column flex-grow-1 m-l-m">
        <div className="is-size-5">Media Title</div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        In erat mauris, faucibus quis pharetra sit amet, pretium ac libero.
        Etiam vehicula eleifend bibendum.
      </div>
    </div>

    <div className="mj-box align-start">
      <img className="flex-order-1 m-l-m" src="http://via.placeholder.com/128x128" alt=""/>
      <div className="flex-column flex-grow-1">
        <div className="is-size-5">Media Title</div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        In erat mauris, faucibus quis pharetra sit amet, pretium ac libero.
        Etiam vehicula eleifend bibendum.
      </div>
    </div>
  </React.Fragment>
)