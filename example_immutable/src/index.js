import React from 'react';
import Immutable from 'immutable';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import {
    createStateSyncMiddleware,
    // initMessageListener,
    initStateWithPrevTab,
} from './lib/syncState';

const initialState = Immutable.Map();

const middlewares = [
    // TOGGLE_TODO will not be triggered
    createStateSyncMiddleware({
        prepareState: state => state.toJS(),
        // predicate: (action) => action.type !== 'TOGGLE_TODO',
    }),
];

const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares));
// initMessageListener(store);
initStateWithPrevTab(store);
render(
  <Provider store={store}>
    <App />
  </Provider>,
    // eslint-disable-next-line no-undef
    document.getElementById('root'),
);

registerServiceWorker();
