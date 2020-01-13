import { combineReducers } from 'redux';

/**
 * @param config
 * @example
 *   createReducer({
 *     initialState: {},
 *     reducers: {
 *       [action1.type]: (state, action) => nextState,
 *       [action2.type]: (state, action) => nextState,
 *     }
 *   })
 *   createReducer({
 *     slice1: {
 *       initialState: {},
 *       reducers: {
 *         [action11.type]: (state, action) => nextState,
 *         [action12.type]: (state, action) => nextState,
 *       }
 *     },
 *     slice2: {
 *       initialState: {},
 *       reducers: {
 *         [action21.type]: (state, action) => nextState,
 *         [action22.type]: (state, action) => nextState,
 *       }
 *     },
 *   })
 */
export default function createReducer(config) {
  const safeConfig = config || {};

  if (safeConfig.reducers) {
    const { initialState, reducers } = safeConfig;
    return (state = initialState, action) => {
      const reducer = reducers[action.type] || reducers['*'];
      return typeof reducer === 'function' ? reducer(state, action) : state;
    };
  }

  const reducerSlices = Object.entries(safeConfig).reduce((dict, [sliceName, sliceConfig]) => {
    dict[sliceName] = createReducer(sliceConfig);
    return dict;
  }, {});
  return combineReducers(reducerSlices);
}
