import { combineReducers } from 'redux';
import createAction from './createAction';
import createReducer from './createReducer';
import injectEpics from './injectEpics';
import injectReducers from './injectReducers';

const { isArray } = Array;

/**
 * @param config
 * @example
 *   createStore({
 *     name: 'user', // required
 *     initialState: defaultInitialState,
 *     actions: {
 *       set: () => ({ }),
 *       reset: () => ({ })
 *     },
 *     reducers: {
 *       set: (state, action) => nextState,
 *       reset: (state, action) => nextState,
 *     },
 *   })
 *   createStore({
 *     name: 'user',
 *     slices: [
 *       { name: 's1', initialState, actions: { set, reset }, reducers: { set, reset } },
 *       { name: 's2', slices: [{ name: 'ss1', initialState, actions: { set, reset }, reducers: { set, reset } }] },
 *     ],
 *   }) => 返回 [{
 *     s1: { set, reset },
 *     s2: { ss1: { set, reset } },
 *   }, reducer]
 */
function _createStore(config) {
  const safeConfig = config || {};

  if (isArray(safeConfig.slices)) {
    const actions = {};
    const reducers = {};

    safeConfig.slices.forEach(sliceConfig => {
      const { scope, name } = safeConfig;
      sliceConfig.scope = `${name}${scope ? '/' : ''}${scope || ''}`;
      const [sliceActions, sliceReducer] = _createStore(sliceConfig);
      const sliceName = sliceConfig.name;
      actions[sliceName] = sliceActions;
      reducers[sliceName] = sliceReducer;
    });

    const reducer = combineReducers(reducers);
    return [actions, reducer];
  }

  if (safeConfig.actions && safeConfig.reducers) {
    const {
      scope = '',
      name,
      initialState,
      actions: actionsConfig,
      reducers: reducersConfig,
      epics: epicsConfig,
    } = safeConfig;
    const getActionType = type => `${type}/${name}${scope ? '/' : ''}${scope}`;

    const actions = Object.entries(actionsConfig).reduce((dict, [actionName, actionCreator]) => {
      const action = createAction(getActionType(actionName), actionCreator);
      dict[actionName] = action;
      return dict;
    }, {});

    const reducers = Object.entries(reducersConfig).reduce((dict, [reducerName, sliceReducer]) => {
      const action = actions[reducerName];
      if (action) {
        dict[action] = sliceReducer;
      }
      return dict;
    }, {});

    const reducer = createReducer({ initialState, reducers });

    if (epicsConfig) {
      const epics = Object.entries(epicsConfig)
        .map(([, epicCreator]) => {
          if (typeof epicCreator !== 'function') {
            return null;
          }
          return epicCreator(actions);
        })
        .filter(Boolean);
      injectEpics(...epics);
    }

    return [actions, reducer];
  }

  return null;
}

export default function createStore(config) {
  const store = _createStore(config);
  if (store) {
    const { name } = config;
    const [, reducer] = store;
    injectReducers({ [name]: reducer });
  }
  return store;
}
