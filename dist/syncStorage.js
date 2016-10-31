'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionStorageMiddleware = undefined;
exports.timestampAction = timestampAction;
exports.createStorageListener = createStorageListener;

var _indexOf = require('lodash/indexOf');

var _indexOf2 = _interopRequireDefault(_indexOf);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        var stampedAction = timestampAction(action);
        lastTimeStamp = stampedAction.$time;
        localStorage.setItem(LAST_ACTION, JSON.stringify(stampedAction));
      }
      return next(action);
    };
  };
};

function createStorageListener(store, config) {
  var ignore = [];
  if (config) {
    ignore = (0, _get2.default)(config, 'ignore', []);
  }
  window.addEventListener('storage', function (event) {
    var _JSON$parse = JSON.parse(event.newValue),
        stampedAction = _JSON$parse.stampedAction;

    if (stampedAction && stampedAction.$time !== lastTimeStamp && (0, _indexOf2.default)(ignore, stampedAction.type) < 0) {
      lastTimeStamp = stampedAction.$time;
      store.dispatch(stampedAction);
    }
  });
}