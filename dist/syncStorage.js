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
          console.log("Your browser doesn't support localStorage");
        }
      }
      return next(action);
    };
  };
};

function createStorageListener(store, config) {
  var ignore = [];
  if (config) {
    ignore = Object.prototype.toString.call(config.ignore) === '[object Array]' ? config.ignore : [];
  }
  window.addEventListener('storage', function (event) {
    if (event.key === LAST_ACTION) {
      var _JSON$parse = JSON.parse(event.newValue),
          stampedAction = _JSON$parse.stampedAction;

      if (stampedAction && stampedAction.$time !== lastTimeStamp && ignore.indexOf(stampedAction.type) === -1) {
        lastTimeStamp = stampedAction.$time;
        store.dispatch(stampedAction);
      }
    }
  });
}