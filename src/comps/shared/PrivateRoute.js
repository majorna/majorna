import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import config from '../../data/config'

export default ({render, component: Component, ...rest}) =>
  <Route
    {...rest}
    render={props => config.server.token ?
      (render ? render(props) : <Component {...props} />) : <Redirect to={{pathname: "/", state: {from: props.location}}} />}
  />
