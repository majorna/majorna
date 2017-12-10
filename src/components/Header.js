import React, { Component } from 'react';
import logo from '../res/majorna.png';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {login: false};
  }

  render() {
    return (
      <header className="Header-header">
        <img src={logo} className="Header-logo" alt="Majorna" />
      </header>
    );
  }
}

export default Header;
