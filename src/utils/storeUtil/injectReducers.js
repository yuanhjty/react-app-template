import { combineReducers } from 'redux';
import { store } from './storeConfig';

export default function injectReducers(reducersDict) {
  store.reducers = store.reducers || {};
  Object.entries(reducersDict).forEach(([name, reducer]) => {
    if (store.reducers[name]) {
      console.warn(`State slice [${name}] already exists!`);
    }
    store.reducers[name] = reducer;
  });
  const rootReducer = combineReducers(store.reducers);
  store.replaceReducer(rootReducer);
}
