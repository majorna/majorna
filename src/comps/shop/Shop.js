import React from 'react'
import { Link } from 'react-router-dom'
import mj from '../../res/mj.png'

export default props =>
  <React.Fragment>
    <div className="mj-box flex-column">
      <div className="is-size-5 has-text-centered">Shop</div>
    </div>

    <div className="mj-box shop-grid">
      <Link className="mj-box flex-column center-all" to="/shop/majorna">
        <span>Majorna</span>
        <img className="m-t-s" src={mj} width="150" height="150" alt="Majorna"/>
        <button className="button is-small is-info is-outlined m-t-s">Details</button>
      </Link>

      <Link className="mj-box flex-column center-all" to="/shop/bitcoin">
        <span>Bitcoin</span>
        <i className="fab fa-bitcoin m-t-s" style={{width: 110, height: 110}}/>
        <button className="button is-small is-info is-outlined m-t-s">Details</button>
      </Link>

      <Link className="mj-box flex-column center-all" to="/shop/ethereum">
        <span>Ethereum</span>
        <i className="fab fa-ethereum m-t-s" style={{width: 110, height: 110}}/>
        <button className="button is-small is-info is-outlined m-t-s">Details</button>
      </Link>

      <Link className="mj-box flex-column center-all" to="/shop/usdollar">
        <span>US Dollar</span>
        <i className="fas fa-dollar-sign m-t-s" style={{width: 110, height: 110}}/>
        <button className="button is-small is-info is-outlined m-t-s">Details</button>
      </Link>

      <Link className="mj-box flex-column center-all" to="/shop/euro">
        <span>Euro</span>
        <i className="fas fa-euro-sign m-t-s" style={{width: 110, height: 110}}/>
        <button className="button is-small is-info is-outlined m-t-s">Details</button>
      </Link>

      <Link className="mj-box flex-column center-all" to="/shop/crowner">
        <span>Crowner</span>
        <img className="m-t-s" width="150" height="150" src="https://lh3.googleusercontent.com/A8TzrOKsyHUWTEg0-2Qr6aFLvWhCJUq37M4E_BC3qB9JXAjxTnu4GXel3sSa-ysnx_cz=s360" alt="Crowner"/>
        <button className="button is-small is-info is-outlined m-t-s">Details</button>
      </Link>
    </div>

    <div className="mj-box flex-column">
      Footer text about what shop is..
    </div>
  </React.Fragment>
