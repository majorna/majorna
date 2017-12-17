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
              <li className="nav-item"><a className="nav-link" href="/account">Account</a></li>
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

        <main role="main">
          <div className="jumbotron">
            <div className="container">
              <h1 className="display-3">Hello, world!</h1>
              <p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
              <p><a className="btn btn-primary btn-lg" href="/" role="button">Learn more &raquo;</a></p>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h2>Heading</h2>
                <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
                <p><a className="btn btn-secondary" href="/" role="button">View details &raquo;</a></p>
              </div>
              <div className="col-md-4">
                <h2>Heading</h2>
                <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
                <p><a className="btn btn-secondary" href="/" role="button">View details &raquo;</a></p>
              </div>
              <div className="col-md-4">
                <h2>Heading</h2>
                <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
                <p><a className="btn btn-secondary" href="/" role="button">View details &raquo;</a></p>
              </div>
            </div>
          </div>
        </main>

        <footer className="container">
          <p>&copy; 2018 Teoman Soygul</p>
        </footer>
      </React.Fragment>
    );
  }
}

export default App;
