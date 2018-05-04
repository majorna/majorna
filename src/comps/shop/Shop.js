import React from 'react'
import { Link } from 'react-router-dom'
import builtInItems from './BuiltInItems'

export default props =>
  <React.Fragment>
    <div className="mj-box flex-column center-all">
      <div className="is-size-5">Shop</div>
    </div>

    <div className="mj-box shop-grid">
      {builtInItems.map(item =>
        <Link className="mj-box flex-column center-all" to={'/shop/' + item.id} key={item.id}>
          <span>{item.name}</span>
          {item.googlePlayUrl && <img className="m-t-xs" width="150" src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" alt="Get it on Google Play"/>}
          {item.imageUrl && <img className="m-t-s" src={item.imageUrl} width="150" height="150" alt={item.name}/>}
          {item.fontIcon && <i className={item.fontIcon + ' m-t-s'} style={{width: 110, height: 110}}/>}
          <button className="button is-small is-info is-outlined m-t-s">Details</button>
        </Link>
      )}
    </div>

    <div className="mj-box flex-column center-all">
      <button className="button is-info" disabled><i className="fas fa-sign-in-alt m-r-s"/>Merchant Login</button>
    </div>
  </React.Fragment>
