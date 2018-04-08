import React from 'react'
import { Link } from 'react-router-dom'
import mj from '../../res/mj.png'

export default props =>
  <React.Fragment>
    <div className="mj-box flex-column">
      <div className="is-size-5 has-text-centered">Shop</div>
    </div>

    <div className="mj-box shop-grid">
      <div className="mj-box flex-column center-all">
        <span>Majorna</span>
        <Link to="/shop/majorna"><img src={mj} width="150" height="150" alt="Majorna"/></Link>
        <Link className="button is-small is-info" to="/shop/majorna">Details</Link>
      </div>

      <div className="mj-box flex-column center-all">
        <span>Bitcoin</span>
        <i className="fab fa-bitcoin" style={{width: 110, height: 110}}/>
      </div>

      <div className="mj-box flex-column center-all">
        <span>Ethereum</span>
        <i className="fab fa-ethereum" style={{width: 110, height: 110}}/>
      </div>

      <div className="mj-box flex-column center-all">
        <span>US Dollar</span>
        <i className="fas fa-dollar-sign" style={{width: 110, height: 110}}/>
      </div>

      <div className="mj-box flex-column center-all">
        <span>Euro</span>
        <i className="fas fa-euro-sign" style={{width: 110, height: 110}}/>
      </div>

      <div className="mj-box flex-column center-all">
        <span>Crowner</span>
        <img width="150" height="150" src="https://lh3.googleusercontent.com/A8TzrOKsyHUWTEg0-2Qr6aFLvWhCJUq37M4E_BC3qB9JXAjxTnu4GXel3sSa-ysnx_cz=s360-rw" alt="Crowner"/>
      </div>
    </div>

    <div className="mj-box flex-column">
      Footer text about what shop is..
    </div>
  </React.Fragment>
