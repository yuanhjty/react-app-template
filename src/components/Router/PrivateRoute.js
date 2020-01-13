import React from 'react';
import { Redirect } from 'react-router-dom';
import PublicRoute from './PublicRoute';

const AVAILABLE = 'AVAILABLE';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const NEED_LOGIN = 'NEED_LOGIN';

// mock authenticate
function authenticate(/* props */) {
  return NEED_LOGIN;
}

const targets = {
  [AVAILABLE]: PublicRoute,
  [NOT_AUTHORIZED]: () => <Redirect to="/not_authorized" />,
  [NEED_LOGIN]: () => <Redirect to="/login" />,
};

export default function PrivateRoute(props) {
  const authority = authenticate(props);
  const Component = targets[authority];
  if (!Component) {
    console.error('unknown authority');
    return null;
  }
  return <Component {...props} />;
}
