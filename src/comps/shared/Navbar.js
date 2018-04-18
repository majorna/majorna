import React, { Component } from 'react'
import logo from '../../res/majorna.png'
import { Link, NavLink } from 'react-router-dom'

export default class extends Component {
  state = {navOpen: false}

  handleExpandClick = () => this.setState(s => ({navOpen: !s.navOpen}))

  closeNav = () => this.setState(s => ({navOpen: false}))

  logout = async () => {
    this.closeNav()
    await this.props.logout()
  }

  render = () =>
    <div className="navbar is-light">
      <div className="navbar-brand">
        <a className="navbar-item" href="/"><img src={logo} alt="Majorna"/></a>
        <div className={"navbar-burger" + (this.state.navOpen ? ' is-active' : '')} onClick={this.handleExpandClick}><span/><span/><span/></div>
      </div>
      <div className={"navbar-menu" + (this.state.navOpen ? ' is-active' : '')}>
        {!this.props.user ? (
          <div className="navbar-end">
            <NavLink className="navbar-item" activeClassName="is-active" to='/about' onClick={this.closeNav}>About</NavLink>
            <NavLink className="navbar-item" activeClassName="is-active" to='/login' onClick={this.closeNav}>Log In | Sign Up</NavLink>
          </div>
        ) : (
          <div className="navbar-end">
            <NavLink className="navbar-item" activeClassName="is-active" to='/dashboard' onClick={this.closeNav}>Dashboard</NavLink>
            <NavLink className="navbar-item" activeClassName="is-active" to='/shop' onClick={this.closeNav}>Shop</NavLink>
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">{this.props.user.displayName}</a>
              <div className="navbar-dropdown is-boxed is-right">
                <NavLink className="navbar-item" activeClassName="is-active" to='/about' onClick={this.closeNav}>About</NavLink>
                <NavLink className="navbar-item" activeClassName="is-active" to='/profile' onClick={this.closeNav}>Profile</NavLink>
                <Link className="navbar-item" to='/' onClick={this.logout}>Logout</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
}
