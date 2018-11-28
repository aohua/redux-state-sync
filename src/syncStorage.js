/* eslint-env browser */
import BroadcastChannel from 'broadcast-channel';

let lastUuid = 0;
const GET_INIT_STATE = '&_GET_INIT_STATE';
const SEND_INIT_STATE = '&_SEND_INIT_STATE';
const RECEIVE_INIT_STATE = '&_RECEIVE_INIT_STATE';

const defaultConfig = {
  channel: 'redux_state_sync',
  initiateWithState: false,
  predicate: null,
  blacklist: [],
  whitelist: [],
  broadcastChannelOption: null,
};

const getIniteState = () => ({ type: GET_INIT_STATE });
const sendIniteState = () => ({ type: SEND_INIT_STATE });
const receiveIniteState = state => ({ type: RECEIVE_INIT_STATE, payload: state });

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function guid() {
  return (
    `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
  );
}

// generate current window unique id
const WINDOW_STATE_SYNC_ID = guid();
// if the message receiver is already created
let isMessageListenerCreated = false;
// export for test
export function generateUuidForAction(action) {
  const stampedAction = action;
  stampedAction.$uuid = guid();
  stampedAction.$wuid = WINDOW_STATE_SYNC_ID;
  return stampedAction;
}
// export for test
export function isActionAllowed({ predicate, blacklist, whitelist }) {
  let allowed = () => true;

  if (predicate && typeof predicate === 'function') {
    allowed = predicate;
  } else if (Array.isArray(blacklist)) {
    allowed = type => blacklist.indexOf(type) < 0;
  } else if (Array.isArray(whitelist)) {
    allowed = type => whitelist.indexOf(type) >= 0;
  }
  return allowed;
}
// export for test
export function createMessageListener({ channel, dispatch, allowed }) {
  let isSynced = false;
  const tabs = {};
  const messageChannel = channel;
  messageChannel.onmessage = (stampedAction) => {
    // ignore if this action is triggered by this window
    // IE bug https://stackoverflow.com/questions/18265556/why-does-internet-explorer-fire-the-window-storage-event-on-the-window-that-st
    if (stampedAction.$wuid === WINDOW_STATE_SYNC_ID || stampedAction.type === RECEIVE_INIT_STATE) {
      return;
    }
    // ignore other values that saved to localstorage.
    if (stampedAction.$uuid && stampedAction.$uuid !== lastUuid) {
      if (stampedAction.type === GET_INIT_STATE && !tabs[stampedAction.$wuid]) {
        tabs[stampedAction.$wuid] = true;
        dispatch(sendIniteState());
      } else if (stampedAction.type === SEND_INIT_STATE && !tabs[stampedAction.$wuid]) {
        if (!isSynced) {
          isSynced = true;
          dispatch(receiveIniteState(stampedAction.payload));
        }
        return;
      } else if (allowed(stampedAction.type)) {
        lastUuid = stampedAction.$uuid;
        dispatch(stampedAction);
      }
    }
  };
}

export const createStateSyncMiddleware = (config = defaultConfig) => {
  const allowed = isActionAllowed(config);
  const channel = new BroadcastChannel(config.channel, config.broadcastChannelOption);

  return ({ getState, dispatch }) => next => (action) => {
    // create message receiver
    if (!isMessageListenerCreated) {
      isMessageListenerCreated = true;
      createMessageListener({ channel, dispatch, allowed });
    }
    // post messages
    if (action && !action.$uuid) {
      const stampedAction = generateUuidForAction(action);
      lastUuid = stampedAction.$uuid;
      try {
        if (action.type === SEND_INIT_STATE) {
          if (getState()) {
            stampedAction.payload = getState();
            channel.postMessage(stampedAction);
          }
          return next(action);
        }
        if (allowed(stampedAction.type) || action.type === GET_INIT_STATE) {
          channel.postMessage(stampedAction);
        }
      } catch (e) {
        console.error("Your browser doesn't support cross tab communication");
      }
    }
    return next(action);
  };
};

// init state with other tab's state
export const withReduxStateSync = appReducer =>
  ((state, action) => {
    let initState = state;
    if (action.type === RECEIVE_INIT_STATE) {
      initState = action.payload;
    }
    return appReducer(initState, action);
  });

export const initStateWithPrevTab = ({ dispatch }) => {
  dispatch(getIniteState());
};
