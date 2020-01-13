import { of, empty, interval } from 'rxjs';
import { mergeMap, takeUntil, catchError, retry, repeatWhen } from 'rxjs/operators';
import { ofType } from 'redux-observable';

const ensureNumber = (maybeNumber, defaultNumber) => Number(maybeNumber) || defaultNumber || 0;
const { isArray } = Array;

const createAjaxEpic = ({
  request,
  cancel,
  success,
  fail,
  pollingCycle: globalPollingCycle,
  retryTimes: globalRetryTimes,
}) => (action$, state$, { ajax }) =>
  action$.pipe(
    ofType(request.type),
    mergeMap(action => {
      const { ajaxParams, pollingCycle: localPollingCycle, retryTimes: localRetryTimes } = action;

      const paramList = isArray(ajaxParams) ? ajaxParams : [ajaxParams];
      const pollingCycle = ensureNumber(
        localPollingCycle === undefined ? globalPollingCycle : localPollingCycle,
      );
      const retryTimes = ensureNumber(
        localRetryTimes === undefined ? globalRetryTimes : localRetryTimes,
      );

      return ajax(...paramList).pipe(
        retry(retryTimes),
        catchError(err => (typeof fail === 'function' ? of(fail(err)) : empty())),
        mergeMap(res => (typeof success === 'function' ? of(success(res)) : empty())),
        repeatWhen(() => (pollingCycle > 0 ? interval(pollingCycle) : empty())),
        takeUntil(action$.pipe(ofType(cancel.type))),
      );
    }),
  );

export default createAjaxEpic;
