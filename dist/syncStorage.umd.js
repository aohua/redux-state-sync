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

/***/ })
/******/ ]);
});
//# sourceMappingURL=syncStorage.umd.js.map