import React, { Component } from 'react';
import logo from '../res/majorna.png';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount = () => this.timerID = setInterval(() => this.setState({date: new Date()}), 1000);
  componentWillUnmount = () => clearInterval(this.timerID);

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <header className="Header-header">
        <img src={logo} className="Header-logo" alt="logo" />
        <h1 className="Header-title">It is {this.state.date.toLocaleTimeString()}.</h1>
      </header>
    );
  }
}

export default Header;
