import React from 'react'

export default props => {
  const item = {
    id: props.match.params.id,
    unavailable: true,
    name: '',
    description: ''
  }

  switch (item.id) {
    case 'majorna':
      item.name = 'Majorna'
      item.description = 'Buy mj using US Dollar, Euro, Bitcoin, or Ethereum.'
      break;
    case 'bitcoin':
      break;
    case 'ethereum':
      break;
    case 'usdollar':
      break;
    case 'euro':
      break;
    case 'crowner':
      break;
    default:
      break;
  }

  function handleBuy () {}

  return (
    <div className="mj-box flex-column center-all">
      <div className="is-size-5 has-text-centered" style={{textTransform: 'capitalize'}}>Buy - {item.id}</div>

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