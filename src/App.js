import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import logo from './res/majorna.png';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
          <a className="navbar-brand" href="/">
            <img src={logo} width="120" alt="Majorna"/>
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-content">
            <span className="navbar-toggler-icon"/>
          </button>

          <div className="collapse navbar-collapse" id="navbar-content">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item"><a className="nav-link" href="/accounts">Accounts</a></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="http://example.com" data-toggle="dropdown">Profile</a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="/settings">Settings</a>
                  <a className="dropdown-item" href="/logout">Logout</a>
                </div>
              </li>
            </ul>
          </div>
        </nav>

        <div className="jumbotron text-center">
          <h1 className="display-4">Send and Receive Majorna</h1>
          <p className="lead">Simple crypto currency with built-in banking services.</p>
          <a className="btn btn-info btn-lg" href="/">Get Started</a>
        </div>

        <footer className="container">
          <p>&copy; 2018 Majorna Team</p>
        </footer>
      </React.Fragment>
    );
  }
}

export default App;
