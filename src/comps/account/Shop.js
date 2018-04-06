import React from 'react'
import mj from '../../res/mj.png'

export default props =>
  <React.Fragment>
    <div className="mj-box flex-column">
      <div className="is-size-5 has-text-centered">Shop</div>
    </div>

    <div className="mj-box shop-grid">
      <div className="mj-box flex-column center-all">
        <span>Majorna</span>
        <img src={mj} width="150" height="150" alt="Majorna"/>
      </div>

      <div className="mj-box flex-column center-all">
        <span>US Dollar</span>
        <i className="fas fa-dollar-sign" style={{width: 120, height: 120}}/>
      </div>

      <div className="mj-box flex-column center-all">
        <span>Bitcoin</span>
        <i className="fab fa-bitcoin" style={{width: 120, height: 120}}/>
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

// const details = props =>
//   <div className="mj-box flex-column center-all">
//     <div className="is-size-5 has-text-centered">Purchase - {props.product.name}</div>
//   </div>