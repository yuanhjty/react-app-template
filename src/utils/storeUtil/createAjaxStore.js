import { removeFields } from 'utils/objectUtil';
import createStore from './createStore';
import createAjaxEpic from './createAjaxEpic';

const { isArray } = Array;

const initialState = {
  data: null,
  error: null,
  dirty: false,
  pending: false,
};

const successAction = data => ({ data });
const failAction = error => ({ error });
const cancelAction = () => ({});
const resetAction = () => ({});

const requestReducer = (state, action) => ({
  ...state,
  pending: true,
  ...removeFields(action, 'ajaxParams'),
});
const successReducer = (state, { data, ...rest }) => ({
  ...state,
  pending: false,
  dirty: true,
  data,
  ...rest,
});
const failReducer = (state, { error, ...rest }) => ({
  ...state,
  pending: false,
  dirty: true,
  error,
  ...rest,
});
const cancelReducer = (state, action) => ({ ...state, pending: false, ...action });

function buildAjaxStoreConfig(config) {
  const safeConfig = { ...config };
  if (!('initialState' in safeConfig)) {
    safeConfig.initialState = initialState;
  }
  if (isArray(safeConfig.slices)) {
    safeConfig.slices = safeConfig.slices.map(sliceConfig => buildAjaxStoreConfig(sliceConfig));
  }
  if (safeConfig.actions) {
    const { actions, reducers } = safeConfig;
    safeConfig.actions = {
      success: successAction,
      fail: failAction,
      cancel: cancelAction,
      reset: resetAction,
      ...actions,
    };
    safeConfig.reducers = {
      request: requestReducer,
      success: successReducer,
      fail: failReducer,
      cancel: cancelReducer,
      reset: () => safeConfig.initialState,
      ...reducers,
    };
    safeConfig.epics = {
      ajax: createAjaxEpic,
    };
  }
  return safeConfig;
}

/**
 * @example
 *   createAjaxStore({
 *     name: 'users',
 *     actions: {
 *       request: (offset = 0, limit = 20) => ({ ajaxParams: [], offset, limit }),
 *     }
 *   })
 */
export default function createAjaxStore(config) {
  return createStore(buildAjaxStoreConfig(config));
}
