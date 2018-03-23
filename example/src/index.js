import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import { actionStorageMiddleware, createStorageListener } from './lib/syncStorage'

const middlewares = [
  actionStorageMiddleware,
];
 
const store = createStore(rootReducer, {}, applyMiddleware(...middlewares))

createStorageListener(store, { initiateWithState: true })
 
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();
