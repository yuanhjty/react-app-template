import React from 'react';
import loadable from '@loadable/component';
import { PublicRoute, Redirect } from 'components/Router';

const RedirectToHomePage = () => <Redirect to="/home" />;
const HomePage = loadable(() => import('./HomePage'));

export default function HomeRoutes(props) {
  return (
    <>
      <PublicRoute {...props} path="/" component={RedirectToHomePage} />
      <PublicRoute {...props} path="/home" component={HomePage} />
    </>
  );
}
