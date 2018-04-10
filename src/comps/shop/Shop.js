import React from 'react'
import { Link } from 'react-router-dom'
import mj from '../../res/mj.png'

const builtInItems = [
  {
    id: 'majorna',
    name: 'Majorna',
    unavailable: true,
    description: 'Buy Majorna using US Dollar, Euro, Bitcoin, or Ethereum.',
    imageUrl: mj
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    unavailable: true,
    description: 'Buy Bitcoin using your Majorna balance.',
    fontIcon: 'fab fa-bitcoin'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    unavailable: true,
    description: 'Buy Ethereum using your Majorna balance.',
    fontIcon: 'fab fa-ethereum'
  },
  {
    id: 'usdollar',
    name: 'US Dollar',
    unavailable: true,
    description: 'Buy US Dollar using your Majorna balance.',
    fontIcon: 'fas fa-dollar-sign'
  },
  {
    id: 'euro',
    name: 'Euro',
    unavailable: true,
    description: 'Buy Euro using your Majorna balance.',
    fontIcon: 'fas fa-euro-sign'
  },
  {
    id: 'crowner',
    name: 'Crowner',
    unavailable: true,
    description: 'Choose your own adventure: rule your kingdom of prosperity... or ruins. Click on Google Play icon for game details.',
    imageUrl: 'https://lh3.googleusercontent.com/A8TzrOKsyHUWTEg0-2Qr6aFLvWhCJUq37M4E_BC3qB9JXAjxTnu4GXel3sSa-ysnx_cz=s360',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.soygul.crowner'
  },
]

export default props =>
  <React.Fragment>
    <div className="mj-box flex-column center-all">
      <div className="is-size-5">Shop</div>
      <div className="m-t-s">Currently all items in the shop are only for preview. You can vote for future products to be made available at the bottom of this page.</div>
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
  </React.Fragment>
