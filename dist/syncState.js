'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initMessageListener = exports.initStateWithPrevTab = exports.withReduxStateSync = exports.createReduxStateSync = exports.createStateSyncMiddleware = undefined;
exports.generateUuidForAction = generateUuidForAction;
exports.isActionAllowed = isActionAllowed;
exports.isActionSynced = isActionSynced;
exports.MessageListener = MessageListener;

var _broadcastChannel = require('broadcast-channel');

var lastUuid = 0;
var GET_INIT_STATE = '&_GET_INIT_STATE';
var SEND_INIT_STATE = '&_SEND_INIT_STATE';
var RECEIVE_INIT_STATE = '&_RECEIVE_INIT_STATE';
var INIT_MESSAGE_LISTENER = '&_INIT_MESSAGE_LISTENER';

var defaultConfig = {
    channel: 'redux_state_sync',
    predicate: null,
    blacklist: [],
    whitelist: [],
    broadcastChannelOption: undefined,
    prepareState: function prepareState(state) {
        return state;
    }
};

var getIniteState = function getIniteState() {
    return { type: GET_INIT_STATE };
};
var sendIniteState = function sendIniteState() {
    return { type: SEND_INIT_STATE };
};
var receiveIniteState = function receiveIniteState(state) {
    return { type: RECEIVE_INIT_STATE, payload: state };
};
var initListener = function initListener() {
    return { type: INIT_MESSAGE_LISTENER };
};

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function guid() {
    return '' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// generate current window unique id
var WINDOW_STATE_SYNC_ID = guid();
// export for test
function generateUuidForAction(action) {
    var stampedAction = action;
    stampedAction.$uuid = guid();
    stampedAction.$wuid = WINDOW_STATE_SYNC_ID;
    return stampedAction;
}
// export for test
function isActionAllowed(_ref) {
    var predicate = _ref.predicate,
        blacklist = _ref.blacklist,
        whitelist = _ref.whitelist;

    var allowed = function allowed() {
        return true;
    };

    if (predicate && typeof predicate === 'function') {
        allowed = predicate;
    } else if (Array.isArray(blacklist)) {
        allowed = function allowed(action) {
            return blacklist.indexOf(action.type) < 0;
        };
    } else if (Array.isArray(whitelist)) {
        allowed = function allowed(action) {
            return whitelist.indexOf(action.type) >= 0;
        };
    }
    return allowed;
}
// export for test
function isActionSynced(action) {
    return !!action.$isSync;
}
// export for test
function MessageListener(_ref2) {
    var channel = _ref2.channel,
        dispatch = _ref2.dispatch,
        allowed = _ref2.allowed;

    var isSynced = false;
    var tabs = {};
    this.handleOnMessage = function (stampedAction) {
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
                dispatch(Object.assign(stampedAction, {
                    $isSync: true
                }));
            }
        }
    };
    this.messageChannel = channel;
    this.messageChannel.onmessage = this.handleOnMessage;
}

var createStateSyncMiddleware = exports.createStateSyncMiddleware = function createStateSyncMiddleware() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultConfig;

    var allowed = isActionAllowed(config);
    var channel = new _broadcastChannel.BroadcastChannel(config.channel, config.broadcastChannelOption);
    var prepareState = config.prepareState || defaultConfig.prepareState;
    var messageListener = null;

    return function (_ref3) {
        var getState = _ref3.getState,
            dispatch = _ref3.dispatch;
        return function (next) {
            return function (action) {
                // create message receiver
                if (!messageListener) {
                    messageListener = new MessageListener({ channel: channel, dispatch: dispatch, allowed: allowed });
                }
                // post messages
                if (action && !action.$uuid) {
                    var stampedAction = generateUuidForAction(action);
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
                return next(Object.assign(action, {
                    $isSync: typeof action.$isSync === 'undefined' ? false : action.$isSync
                }));
            };
        };
    };
};

// eslint-disable-next-line max-len
var createReduxStateSync = exports.createReduxStateSync = function createReduxStateSync(appReducer) {
    var prepareState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultConfig.prepareState;
    return function (state, action) {
        var initState = state;
        if (action.type === RECEIVE_INIT_STATE) {
            initState = prepareState(action.payload);
        }
        return appReducer(initState, action);
    };
};

// init state with other tab's state
var withReduxStateSync = exports.withReduxStateSync = createReduxStateSync;

var initStateWithPrevTab = exports.initStateWithPrevTab = function initStateWithPrevTab(_ref4) {
    var dispatch = _ref4.dispatch;

    dispatch(getIniteState());
};

/*
if don't dispath any action, the store.dispath will not be available for message listener.
therefor need to trigger an empty action to init the messageListener.

however, if already using initStateWithPrevTab, this function will be redundant
*/
var initMessageListener = exports.initMessageListener = function initMessageListener(_ref5) {
    var dispatch = _ref5.dispatch;

    dispatch(initListener());
};