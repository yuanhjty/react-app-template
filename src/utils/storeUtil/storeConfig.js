import { mergeMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { createStore, compose, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { IS_PRODUCTION } from 'utils/envUtil';
import { ajax } from 'utils/httpUtil';

const epicMiddleware = createEpicMiddleware({
  dependencies: { ajax },
});

const enhancer = applyMiddleware(epicMiddleware);
const composeEnhancers = IS_PRODUCTION
  ? compose
  : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialReducer = (state = {}) => state;

export const store = createStore(initialReducer, composeEnhancers(enhancer));

export const epicInjector$ = new Subject();
const appEpic = (action$, state$, dependencies) =>
  epicInjector$.pipe(mergeMap(epic => epic(action$, state$, dependencies)));
epicMiddleware.run(appEpic);
