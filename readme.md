# Redux-State-Sync

A light weight middleware to sync your redux state across browser tabs. This module will listens to the window storage event and triggers exactly the same actions triggered in other tabs to make the redux state sync. Furthermore you can also passing in an ignore list to ignore the actions which you don't want to trigger in other tabs(like Api requests).

[![travis build](https://img.shields.io/travis/AOHUA/redux-state-sync.svg)](https://travis-ci.org/AOHUA/redux-state-sync)
[![downloads](https://img.shields.io/npm/dm/redux-state-sync.svg)](https://www.npmjs.com/package/redux-state-sync)

### Installing

Simply install it with npm.

```
npm install --save redux-state-sync
```

### How to use

import actionStorageMiddleware and createStorageListener to your project and follow the example below.

```
import { actionStorageMiddleware, createStorageListener } from 'redux-state-sync';

/*
*  actionStorageMiddleware is used to persist your last action being triggered.
*/
const middlewares = [
  sagaMiddleware,
  logger,
  actionStorageMiddleware,
  routerMiddleware(history),
];

const store = createStore(
  createReducer(),
  fromJS(initialState),
  applyMiddleware(...middlewares)
);
/*
*  Create a listener on store to dispatch the latest action being triggered on other tabs.
*/
createStorageListener(store);
```

You may not want to trigger the Actions which triggers a api request. So you can simply pass in the Action type to ignore it. Like below:

```
const config = {
  ignore: ['CHANGE_USERNAME', 'REPO_REQUEST'],
};
createStorageListener(store, config);

/*
*  To still make your state sync. You need to trigger other actions with the data from the api request.
*  The example is using redux-saga to handle the side effects.
*/

export function* fetchRepoSaga(action) {
  try {
    const repo = yield call(api.fetchRepo, action.url);
    /* Triggers a REPO_SUCCESS and this action should be triggered in other tabs also */
    yield put({ type: 'REPO_SUCCESS', repo });
  } catch (e) {
    yield put({ type: 'REPO_FAILURE', message: e.message });
  }
}

export function* fetchRepoWatcher() {
  yield* takeLatest(REPO.REQUEST, fetchRepoSaga);
}

export default [
  fetchRepoWatcher,
];
```

# Todo
1. Auto get the state from localStorage, if there was another tab opened.
2. A better way to pass in the action ignore list.
