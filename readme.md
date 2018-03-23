# Redux-State-Sync

A lightweight middleware to sync your redux state across browser tabs. It will listen to the window storage event and dispatch exactly the same actions dispatched in other tabs to keep the redux state in sync. Furthermore, you can also pass a list of actions to ignore, so that they wouldn't be dispatched in other tabs (e.g. API requests).

[![travis build](https://img.shields.io/travis/AOHUA/redux-state-sync.svg)](https://travis-ci.org/AOHUA/redux-state-sync)
[![downloads](https://img.shields.io/npm/dm/redux-state-sync.svg)](https://www.npmjs.com/package/redux-state-sync)

### How to install

Simply install it with npm.

```
npm install --save redux-state-sync

or

yarn add redux-state-sync
```

### How to use

import `actionStorageMiddleware` and `createStorageListener`.
Add actionStorageMiddleware to the list of middlewares during store creation.
Call `createStorageListener` to subscribe for storage events and dispatch actions to change store state.

Follow the example below:

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

You may not want to dispatch actions which trigger API requests. To prevent those actions from being dispatched, pass in a list of action types as strings:

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

Thanks to [Olebedev](https://github.com/olebedev), there's another way to ignore actions which you don't want to be dispatched. You can simply provide a predicate function in the config object:

```
const config = {
  predicate: actionType => actionType !== 'GET_REPO',
};
```

GET_REPO action will not be triggered in other tabs in this case.

### Experimental feature

How to init new tab with current tab's state

By default this feature is disabled, you can enable it as below:

```
const config = {
  initiateWithState: true,
};
```

You also need to wrap your root reducer with 'withReduxStateSync' function.
```
import { withReduxStateSync } from 'redux-state-sync'
 
const rootReducer = combineReducers({
  todos,
  visibilityFilter
})

export default withReduxStateSync(rootReducer)
```

This feature is totally experimental, you shall use it at your own risk. ;-)
