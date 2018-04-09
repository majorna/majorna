import React from 'react'
import mj from '../../res/mj.png'

export default props => {
  const item = {
    id: props.match.params.id,
    unavailable: true,
    name: '',
    fontIcon: null,
    imageUrl: null,
    googlePlayUrl: null,
    description: ''
  }

  switch (item.id) {
    case 'majorna':
      item.name = 'Majorna'
      item.description = 'Buy Majorna using US Dollar, Euro, Bitcoin, or Ethereum.'
      item.imageUrl = mj
      break;
    case 'bitcoin':
      item.name = 'Bitcoin'
      item.description = 'Buy Bitcoin using your Majorna balance.'
      item.fontIcon = 'fab fa-bitcoin'
      break;
    case 'ethereum':
      item.name = 'Ethereum'
      item.description = 'Buy Ethereum using your Majorna balance.'
      item.fontIcon = 'fab fa-ethereum'
      break;
    case 'usdollar':
      item.name = 'US Dollar'
      item.description = 'Buy US Dollar using your Majorna balance.'
      item.fontIcon = 'fas fa-dollar-sign'
      break;
    case 'euro':
      item.name = 'Euro'
      item.description = 'Buy Euro using your Majorna balance.'
      item.fontIcon = 'fas fa-euro-sign'
      break;
    case 'crowner':
      item.name = 'Crowner'
      item.description = 'Choose your own adventure: rule your kingdom of prosperity... or ruins. Click on Google Play icon for game details.'
      item.imageUrl = 'https://lh3.googleusercontent.com/A8TzrOKsyHUWTEg0-2Qr6aFLvWhCJUq37M4E_BC3qB9JXAjxTnu4GXel3sSa-ysnx_cz=s360'
      item.googlePlayUrl = 'https://play.google.com/store/apps/details?id=com.soygul.crowner'
      break;
    default:
      break;
  }

  function handleBuy () {}

  return (
    <div className="mj-box flex-column center-all">
      <div className="is-size-5 has-text-centered">Buy - {item.name}</div>

      {item.fontIcon && <i className={item.fontIcon + ' m-t-m'} style={{width: 150, height: 150}}/>}

      {item.imageUrl && <img className="m-t-m" width="150" height="150" src={item.imageUrl} alt={item.name}/>}

      {item.googlePlayUrl &&
        <a href={item.googlePlayUrl} target="_blank" rel="noopener noreferrer">
          <img className="m-t-m" width="150" src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" alt="Get it on Google Play"/>
        </a>
      }

      <strong className="m-t-m">Description</strong>
      <div>{item.description}</div>

      <strong className="m-t-m">Status: {item.unavailable ? <span className="has-text-warning">Unavailable</span> : <span className="has-text-success">Available</span>}</strong>

      <div className="flex-row m-t-l">
        <button className="button is-info" disabled={item.unavailable} onClick={handleBuy}><i className="fas fa-shopping-cart m-r-s"/>Buy</button>
        <button className="button m-l-m" onClick={props.history.goBack}>Cancel</button>
      </div>
    </div>
  )
}