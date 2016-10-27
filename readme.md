# Redux-State-Sync

A middleware to sync your redux state across browser tabs.

### Installing

Simply install it with npm.

```
npm install --save redux-state-sync
```


### How to use

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
*  To still make your state sync. You need to trigger other actions with the data from the *  api request. The example is using redux-saga to handle the side effect.
*/

export function* fetchRepoSaga(action) {
  try {
    const repo = yield call(api.fetchRepo, action.url);
    yield put({ type: 'REPO_SUCCESS', repo });
  } catch (e) {
    yield put({ type: 'REPO_FAILURE', message: e.message });
  }
}

export function* getFatchRepoWatcher() {
  yield* takeLatest(REPO.REQUEST, fetchRepoSaga);
}

export default [
  getFatchRepoWatcher,
];
```
###TODO
1. Create another version with cookie.
