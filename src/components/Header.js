import React, { Component } from 'react';
import logo from '../res/majorna.png';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <header className="Header-header">
        <img src={logo} className="Header-logo" alt="logo" />
        <h1 className="Header-title">Welcome to React</h1>
      </header>
    );
  }
}

export default Header;
