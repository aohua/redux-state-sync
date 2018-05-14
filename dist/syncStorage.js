'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateUuidForAction = generateUuidForAction;
exports.createStorageListener = createStorageListener;
var lastUuid = 0;
var LAST_ACTION = 'LAST_ACTION';
var GET_INIT_STATE = '&_GET_INIT_STATE';
var SEND_INIT_STATE = '&_SEND_INIT_STATE';
var RECEIVE_INIT_STATE = '&_RECEIVE_INIT_STATE';

var defaultConfig = {
  initiateWithState: false,
  predicate: null,
  ignore: []
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

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function generateUuidForAction(action) {
  var stampedAction = action;
  stampedAction.$uuid = guid();
  return stampedAction;
}

var withReduxStateSync = exports.withReduxStateSync = function withReduxStateSync(appReducer) {
  return function (state, action) {
    if (action.type === RECEIVE_INIT_STATE) {
      state = action.payload;
    }
    return appReducer(state, action);
  };
};

var actionStorageMiddleware = exports.actionStorageMiddleware = function actionStorageMiddleware(_ref) {
  var getState = _ref.getState;
  return function (next) {
    return function (action) {
      if (action && !action.$uuid) {
        var stampedAction = generateUuidForAction(action);
        lastUuid = stampedAction.$uuid;
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
  };
};

function createStorageListener(store) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultConfig;

  var isInitiated = false;
  var allowed = function allowed() {
    return true;
  };

  if (config.predicate && typeof config.predicate === 'function') {
    allowed = config.predicate;
  } else if (Array.isArray(config.ignore)) {
    allowed = function allowed(type) {
      return config.ignore.indexOf(type) < 0;
    };
  }

  if (config.initiateWithState) {
    store.dispatch(getIniteState());
  }

  window.addEventListener('storage', function (event) {
    try {
      var stampedAction = JSON.parse(event.newValue);
      // ignore other values that saved to localstorage.
      if (stampedAction.$uuid) {
        if (stampedAction && stampedAction.$uuid !== lastUuid) {
          if (stampedAction.type === GET_INIT_STATE && isInitiated) {
            store.dispatch(sendIniteState());
          } else if (stampedAction.type === SEND_INIT_STATE) {
            store.dispatch(receiveIniteState(stampedAction.payload));
            isInitiated = true;
          } else if (!!allowed(stampedAction.type)) {
            lastUuid = stampedAction.$uuid;
            store.dispatch(stampedAction);
            isInitiated = true;
          }
        }
      }
    } catch (e) {
      // ignore other data format other than JSON
    }
  });
}