import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class GetStarted extends Component {
  handleClick = () => {}

  render() {
    return (
      <div className="hero is-medium is-light">
        <div className="hero-body has-text-centered">
          <h1 className="title is-size-1" style={{marginBottom: '3rem'}}>Send and Receive Majorna</h1>
          <h2 className="subtitle" style={{marginBottom: '3rem'}}>Simple cryptocurrency with built-in services.</h2>
          <div className="field is-grouped is-grouped-centered">
            <p className="control is-hidden-mobile"><input readOnly className="input is-medium" type="text" placeholder="Starter Balance: 500mj" /></p>
            <p className="control"><Link className="button is-medium is-info" to='/login'>Get Started</Link></p>
          </div>
        </div>
      </div>
    );
  }
}
