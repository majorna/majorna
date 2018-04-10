import React from 'react'

export default props => {
  function handleBuy () {}

  return (
    <div className="mj-box flex-column center-all">
      <div className="is-size-5 has-text-centered">Buy - {props.name}</div>

      {props.fontIcon && <i className={props.fontIcon + ' m-t-m'} style={{width: 150, height: 150}}/>}

      {props.imageUrl && <img className="m-t-m" width="150" height="150" src={props.imageUrl} alt={props.name}/>}

      {props.googlePlayUrl &&
        <a href={props.googlePlayUrl} target="_blank" rel="noopener noreferrer">
          <img className="m-t-m" width="150" src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" alt="Get it on Google Play"/>
        </a>
      }

      <strong className="m-t-m">Description</strong>
      <div>{props.description}</div>

      <strong className="m-t-m">Status: {props.unavailable ? <span className="has-text-warning">Unavailable</span> : <span className="has-text-success">Available</span>}</strong>

      <div className="flex-row m-t-l">
        <button className="button is-info" disabled={props.unavailable} onClick={handleBuy}><i className="fas fa-shopping-cart m-r-s"/>Buy</button>
        <button className="button m-l-m" onClick={props.history.goBack}>Cancel</button>
      </div>
    </div>
  )
}