import React, { Component } from 'react';
import logo from '../res/majorna.png';
import { Link } from 'react-router-dom'

export default class Navbar extends Component {
  constructor (props) {
    super(props);
    this.state = {navOpen: false};
  }

  handleExpandClick = () => this.setState(s => ({navOpen: !s.navOpen}));

  closeNav = () => this.setState(s => ({navOpen: false}));

  logout = async () => {
    this.closeNav();
    await this.props.logout();
  }

  render() {
    return (
      <div className="navbar is-light">
        <div className="navbar-brand">
          <a className="navbar-item" href="/"><img src={logo} alt="Majorna"/></a>
          <div className={"navbar-burger" + (this.state.navOpen ? ' is-active' : '')} onClick={this.handleExpandClick}><span/><span/><span/></div>
        </div>
        <div className={"navbar-menu" + (this.state.navOpen ? ' is-active' : '')}>
          <div className="navbar-end">
            {!this.props.user ? (
              <Link className="navbar-item" to='/login' onClick={this.closeNav}>Log In | Sign Up</Link>
            ) : (
              <React.Fragment>
                <Link className="navbar-item" to='/dashboard' onClick={this.closeNav}>Dashboard</Link>
                <div className="navbar-item has-dropdown is-hoverable">
                  <a className="navbar-link">{this.props.user.displayName}</a>
                  <div className="navbar-dropdown is-boxed is-right">
                    <Link className="navbar-item" to='/' onClick={this.logout}>Logout</Link>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}
