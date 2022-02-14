import { BroadcastChannel } from 'broadcast-channel';

let lastUuid = 0;
export const GET_INIT_STATE = '&_GET_INIT_STATE';
export const SEND_INIT_STATE = '&_SEND_INIT_STATE';
export const RECEIVE_INIT_STATE = '&_RECEIVE_INIT_STATE';
export const INIT_MESSAGE_LISTENER = '&_INIT_MESSAGE_LISTENER';

const defaultConfig = {
    channel: 'redux_state_sync',
    predicate: null,
    blacklist: [],
    whitelist: [],
    broadcastChannelOption: undefined,
    prepareState: state => state,
    receiveState: (prevState, nextState) => nextState,
};

const getIniteState = () => ({ type: GET_INIT_STATE });
const sendIniteState = () => ({ type: SEND_INIT_STATE });
const receiveIniteState = state => ({ type: RECEIVE_INIT_STATE, payload: state });
const initListener = () => ({ type: INIT_MESSAGE_LISTENER });

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

function guid() {
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

// generate current window unique id
export const WINDOW_STATE_SYNC_ID = guid();
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
        allowed = action => blacklist.indexOf(action.type) < 0;
    } else if (Array.isArray(whitelist)) {
        allowed = action => whitelist.indexOf(action.type) >= 0;
    }
    return allowed;
}
// export for test
export function isActionSynced(action) {
    return !!action.$isSync;
}
// export for test
export function MessageListener({ channel, dispatch, allowed }) {
    let isSynced = false;
    const tabs = {};
    this.handleOnMessage = stampedAction => {
        // Ignore if this action is triggered by this window
        if (stampedAction.$wuid === WINDOW_STATE_SYNC_ID) {
            return;
        }
        // IE bug https://stackoverflow.com/questions/18265556/why-does-internet-explorer-fire-the-window-storage-event-on-the-window-that-st
        if (stampedAction.type === RECEIVE_INIT_STATE) {
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
            } else if (allowed(stampedAction)) {
                lastUuid = stampedAction.$uuid;
                dispatch(
                    Object.assign(stampedAction, {
                        $isSync: true,
                    }),
                );
            }
        }
    };
    this.messageChannel = channel;
    this.messageChannel.onmessage = this.handleOnMessage;
}

export const createStateSyncMiddleware = (config = defaultConfig) => {
    const allowed = isActionAllowed(config);
    const channel = new BroadcastChannel(config.channel, config.broadcastChannelOption);
    const prepareState = config.prepareState || defaultConfig.prepareState;
    let messageListener = null;

    return ({ getState, dispatch }) => next => action => {
        // create message receiver
        if (!messageListener) {
            messageListener = new MessageListener({ channel, dispatch, allowed });
        }
        // post messages
        if (action && !action.$uuid) {
            const stampedAction = generateUuidForAction(action);
            lastUuid = stampedAction.$uuid;
            try {
                if (action.type === SEND_INIT_STATE) {
                    if (getState()) {
                        stampedAction.payload = prepareState(getState());
                        channel.postMessage(stampedAction);
                    }
                    return next(action);
                }
                if (allowed(stampedAction) || action.type === GET_INIT_STATE) {
                    channel.postMessage(stampedAction);
                }
            } catch (e) {
                console.error("Your browser doesn't support cross tab communication");
            }
        }
        return next(
            Object.assign(action, {
                $isSync: typeof action.$isSync === 'undefined' ? false : action.$isSync,
            }),
        );
    };
};

// eslint-disable-next-line max-len
export const createReduxStateSync = (appReducer, receiveState = defaultConfig.receiveState) => (state, action) => {
    let initState = state;
    if (action.type === RECEIVE_INIT_STATE) {
        initState = receiveState(state, action.payload);
    }
    return appReducer(initState, action);
};

// init state with other tab's state
export const withReduxStateSync = createReduxStateSync;

export const initStateWithPrevTab = ({ dispatch }) => {
    dispatch(getIniteState());
};

/*
if don't dispath any action, the store.dispath will not be available for message listener.
therefor need to trigger an empty action to init the messageListener.

however, if already using initStateWithPrevTab, this function will be redundant
*/
export const initMessageListener = ({ dispatch }) => {
    dispatch(initListener());
};
