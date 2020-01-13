import React from 'react';
import { Route } from 'react-router-dom';

export default function PublicRoute(props) {
  const { component: Component, ...rest } = props;
  return <Route {...rest} render={renderProps => <Component {...rest} {...renderProps} />} />;
}
