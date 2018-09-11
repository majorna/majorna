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
    {props.user.providerData.map((p, i) =>
      <div className="content" key={p.providerId}>
        <ul>
          <li><strong>Provider</strong>: {p.providerId} {i !== 0 && <button className="button is-small is-danger" onClick={async () => {
            await props.user.unlink(p.providerId)
            props.history.goBack()
          }}>Unlink</button>}</li>
          <li><strong>Name</strong>: {p.displayName}</li>
          <li><strong>Email</strong>: {p.email}</li>
          <li><strong>Phone</strong>: {p.phoneNumber}</li>
        </ul>
      </div>
    )}

    <div className="flex-row center-h m-t-l">
      <button className="button" onClick={props.history.goBack}>Close</button>
    </div>
  </div>
