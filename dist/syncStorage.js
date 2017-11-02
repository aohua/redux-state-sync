'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timestampAction = timestampAction;
exports.createStorageListener = createStorageListener;
/* global window localStorage true */
var lastTimeStamp = 0;
var LAST_ACTION = 'LAST_ACTION';

function timestampAction(action) {
  var stampedAction = action;
  stampedAction.$time = Date.now();
  return {
    stampedAction: stampedAction
  };
}

var actionStorageMiddleware = exports.actionStorageMiddleware = function actionStorageMiddleware() {
  return function (next) {
    return function (action) {
      if (action && !action.$time) {
        try {
          var stampedAction = timestampAction(action);
          lastTimeStamp = stampedAction.$time;
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
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var allowed = function allowed() {
    return true;
  };

  if (config.predicate && typeof config.predicate === 'function') {
    allowed = config.predicate;
  } else if (Array.isArray(config.ignore)) {
    allowed = function allowed(type) {
      return config.ignore.indexOf(type) >= 0;
    };
  }

  window.addEventListener('storage', function (event) {
    var _JSON$parse = JSON.parse(event.newValue),
        stampedAction = _JSON$parse.stampedAction;

    if (stampedAction && stampedAction.$time !== lastTimeStamp && !!allowed(stampedAction.type)) {
      lastTimeStamp = stampedAction.$time;
      store.dispatch(stampedAction);
    }
  });
}