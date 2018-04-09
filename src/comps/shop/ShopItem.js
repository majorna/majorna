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
  }

  return (
    <div className="mj-box flex-column center-all">
      <div className="is-size-5 has-text-centered" style={{textTransform: 'capitalize'}}>Purchase - {item.id}</div>

      <button className="button m-t-l" onClick={props.history.goBack}>Back</button>
    </div>
  )
}