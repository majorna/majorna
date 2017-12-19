import React, { Component } from 'react';
import logo from '../res/majorna.png';

export default class Header extends Component {
  render() {
    return (
      <div className="navbar is-light">
        <div className="navbar-brand">
          <a className="navbar-item" href="/"><img src={logo} alt="Majorna"/></a>
          <div className="navbar-burger"><span/><span/><span/></div>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <a className="navbar-item">Accounts</a>
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">Profile</a>
              <div className="navbar-dropdown is-boxed is-right">
                <a className="navbar-item">Settings</a>
                <a className="navbar-item">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
