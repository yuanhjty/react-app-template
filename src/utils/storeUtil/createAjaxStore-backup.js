import { combineReducers } from 'redux';
import { removeFields } from 'utils/objectUtil';
import createAction from './createAction';
import createReducer from './createReducer';
import createAjaxEpic from './createAjaxEpic';
import injectEpics from './injectEpics';
import injectReducers from './injectReducers';

const { isArray } = Array;

const defaultInitialState = {
  data: null,
  error: null,
  dirty: false,
  pending: false,
};

const defaultSuccessAction = data => ({ data });
const defaultFailAction = error => ({ error });

const defaultRequestReducer = (state, action) => ({
  ...state,
  pending: true,
  ...removeFields(action, 'ajaxParams'),
});
const defaultSuccessReducer = (state, { data, ...rest }) => ({
  ...state,
  pending: false,
  dirty: true,
  data,
  ...rest,
});
const defaultFailReducer = (state, { error, ...rest }) => ({
  ...state,
  pending: false,
  dirty: true,
  error,
  ...rest,
});
const defaultCancelReducer = (state, action) => ({ ...state, pending: false, ...action });

/**
 * @param config
 * @example
 *   createAjaxStore({
 *     name: 'user', // required
 *     initialState: defaultInitialState,
 *     actions: {
 *       request: () => ({ ajaxParams: [] }), // required
 *       success: defaultSuccessAction,
 *       fail: defaultFailAction,
 *       cancel: () => ({}),
 *     },
 *     reducers: {
 *       request: defaultRequestReducer,
 *       success: defaultSuccessReducer,
 *       fail: defaultFailReducer,
 *       cancel: defaultCancelReducer,
 *     },
 *   })
 *   createAjaxStore({
 *     name: 'user',
 *     slices: [
 *       { name: 's1', initialState, actions, reducers },
 *       { name: 's2', slices: [{ name: 'ss1', initialState, actions, reducers }] },
 *     ],
 *   }) => 返回 [{
 *     s1: { request, cancel },
 *     s2: { ss1: { request, cancel } },
 *   }, userReducer]
 */
function _createAjaxStore(config) {
  const safeConfig = config || {};

  if (isArray(safeConfig.slices)) {
    const actions = {};
    const reducers = {};

    safeConfig.slices.forEach(sliceConfig => {
      const { scope, name } = safeConfig;
      sliceConfig.scope = `${name}${scope ? '/' : ''}${scope || ''}`;
      const [sliceActions, sliceReducer] = _createAjaxStore(sliceConfig);
      const sliceName = sliceConfig.name;
      actions[sliceName] = sliceActions;
      reducers[sliceName] = sliceReducer;
    });

    const reducer = combineReducers(reducers);
    return [actions, reducer];
  }

  if (safeConfig.actions && safeConfig.actions.request) {
    const { scope = '', name, initialState = defaultInitialState, actions, reducers } = safeConfig;
    const {
      request: requestAction,
      success: successAction,
      fail: failAction,
      cancel: cancelAction,
    } = actions || {};
    const {
      request: requestReducer,
      success: successReducer,
      fail: failReducer,
      cancel: cancelReducer,
    } = reducers || {};

    const getActionType = type => `${type}/${name}${scope ? '/' : ''}${scope}`;
    const request = createAction(getActionType('request'), requestAction);
    const success = createAction(getActionType('success'), successAction || defaultSuccessAction);
    const fail = createAction(getActionType('fail'), failAction || defaultFailAction);
    const cancel = createAction(getActionType('cancel', cancelAction));

    const reducer = createReducer({
      initialState,
      reducers: {
        [request]: requestReducer || defaultRequestReducer,
        [success]: successReducer || defaultSuccessReducer,
        [fail]: failReducer || defaultFailReducer,
        [cancel]: cancelReducer || defaultCancelReducer,
      },
    });

    const epic = createAjaxEpic({
      request,
      success,
      fail,
      cancel,
    });
    injectEpics(epic);

    return [{ request, cancel }, reducer];
  }

  return null;
}

export default function createAjaxStore(config) {
  const store = _createAjaxStore(config);
  if (store) {
    const { name } = config;
    const [, reducer] = store;
    injectReducers({ [name]: reducer });
  }
  return store;
}
