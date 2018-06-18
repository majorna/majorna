import React from 'react'

export default props =>
  <div className="mj-box flex-column box-center w-s">
    <div className="is-size-5 has-text-centered">Profile</div>

    <div className="flex-column m-t-m center-all">
      <img width="128" src={props.user.photoURL} alt={props.user.displayName}/>
    </div>

    <div className="m-t-m"><strong>Name:</strong> {props.user.displayName}</div>
    <div><strong>Email:</strong> {props.user.email}</div>

    <div className="m-t-m"><strong>Authenticated Via:</strong></div>
    {props.user.providerData.map(p => <div key={p.providerId}>{p.providerId}</div>)}

    <div className="flex-row center-h m-t-l">
      <button className="button" onClick={props.history.goBack}>Close</button>
    </div>
  </div>
