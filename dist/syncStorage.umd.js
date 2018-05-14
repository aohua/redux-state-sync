(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["reduxStateSync"] = factory();
	else
		root["reduxStateSync"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ })
/******/ ]);
});
//# sourceMappingURL=syncStorage.umd.js.map