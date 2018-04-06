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
        <span>Crowner</span>
        <img width="150px" src="http://via.placeholder.com/150x150" alt="loremipsum"/>
      </div>

      <div className="mj-box flex-column center-all">
        <span>Crowner</span>
        <img width="150px" src="http://via.placeholder.com/150x150" alt="loremipsum"/>
      </div>

      <div className="mj-box flex-column center-all">
        <span>Crowner</span>
        <img width="150px" src="http://via.placeholder.com/150x150" alt="loremipsum"/>
      </div>

      <div className="mj-box flex-column center-all">
        <span>Crowner</span>
        <img width="150px" src="http://via.placeholder.com/150x150" alt="loremipsum"/>
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