import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'utils/storeUtil';
import { Router } from 'components/Router';
import Routes from './Routes';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes />
      </Router>
    </Provider>
  );
}
