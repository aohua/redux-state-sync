/* global window localStorage true */
let lastTimeStamp = 0;
const LAST_ACTION = 'LAST_ACTION';
const GET_INIT_STATE = '&_GET_INIT_STATE';
const SEND_INIT_STATE = '&_SEND_INIT_STATE';
const RECEIVE_INIT_STATE = '&_RECEIVE_INIT_STATE';

const defaultConfig = {
  initiateWithState: false,
  predicate: null,
  ignore: [],
}

const getIniteState = () => {
  return { type: GET_INIT_STATE }
}
const sendIniteState = () => {
  return { type: SEND_INIT_STATE }
}
const receiveIniteState = (state) => {
  return { type: RECEIVE_INIT_STATE, payload: state }
}

export function timestampAction(action) {
  const stampedAction = action;
  stampedAction.$time = Date.now();
  return stampedAction;
}

export const withReduxStateSync = (appReducer) => {
  return (state, action) => {
    if (action.type === RECEIVE_INIT_STATE) {
      state = action.payload
    }
    return appReducer(state, action)
  }
}

export const actionStorageMiddleware = ({ getState }) => next => (action) => {
  if (action && !action.$time) {
    const stampedAction = timestampAction(action);
    lastTimeStamp = stampedAction.$time;
    try {
      if (action.type === SEND_INIT_STATE) {
        if (getState()) {
          stampedAction.payload = getState();
          localStorage.setItem(LAST_ACTION, JSON.stringify(stampedAction));
        }
        return next(action);
      }
      localStorage.setItem(LAST_ACTION, JSON.stringify(stampedAction));
    } catch (e) {
      console.error("Your browser doesn't support localStorage");
    }
  }
  return next(action);
};

export function createStorageListener(store, config = defaultConfig) {
  let isInitiated = false;
  let allowed = () => true;

  if (config.predicate && typeof config.predicate === 'function') {
    allowed = config.predicate;
  } else if (Array.isArray(config.ignore)) {
    allowed = type => config.ignore.indexOf(type) < 0;
  }

  if (config.initiateWithState) {
    store.dispatch(getIniteState());
  }

  window.addEventListener('storage', (event) => {
    const stampedAction = JSON.parse(event.newValue);
    if (stampedAction && stampedAction.$time !== lastTimeStamp) {
      if (stampedAction.type === GET_INIT_STATE && isInitiated) {
        store.dispatch(sendIniteState());
      } else if (stampedAction.type === SEND_INIT_STATE) {
        store.dispatch(receiveIniteState(stampedAction.payload));
        isInitiated = true;
      } else if (!!allowed(stampedAction.type)) {
        lastTimeStamp = stampedAction.$time;
        store.dispatch(stampedAction);
        isInitiated = true;
      }
    }
  });
}
