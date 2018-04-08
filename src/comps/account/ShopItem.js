import React from 'react'

export default props => {
  const item = {
    id: props.match.params.id
  }

  return (
    <div className="mj-box flex-column center-all">
      <div className="is-size-5 has-text-centered" style={{textTransform: 'capitalize'}}>Purchase - {item.id}</div>
    </div>
  )
}