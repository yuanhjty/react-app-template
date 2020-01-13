import { combineEpics } from 'redux-observable';
import { epicInjector$ } from './storeConfig';

export default function injectEpic(...epics) {
  epicInjector$.next(combineEpics(...epics));
}
