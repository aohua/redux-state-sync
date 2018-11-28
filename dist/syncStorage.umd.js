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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isPromise;
/* harmony export (immutable) */ __webpack_exports__["c"] = sleep;
/* harmony export (immutable) */ __webpack_exports__["e"] = randomInt;
/* harmony export (immutable) */ __webpack_exports__["d"] = randomToken;
/* harmony export (immutable) */ __webpack_exports__["b"] = microSeconds;
/**
 * returns true if the given object is a promise
 */
function isPromise(obj) {
  if (obj && typeof obj.then === 'function') {
    return true;
  } else {
    return false;
  }
}
function sleep(time) {
  if (!time) time = 0;
  return new Promise(function (res) {
    return setTimeout(res, time);
  });
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
/**
 * https://stackoverflow.com/a/1349426/3443137
 */

function randomToken(length) {
  if (!length) length = 5;
  var text = '';
  var possible = 'abcdefghijklmnopqrstuvwxzy0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
var lastMs = 0;
var additional = 0;
/**
 * returns the current time in micro-seconds,
 * WARNING: This is a pseudo-function
 * Performance.now is not reliable in webworkers, so we just make sure to never return the same time.
 * This is enough in browsers, and this function will not be used in nodejs.
 * The main reason for this hack is to ensure that BroadcastChannel behaves equal to production when it is used in fast-running unit tests.
 */

function microSeconds() {
  var ms = new Date().getTime();

  if (ms === lastMs) {
    additional++;
    return ms * 1000 + additional;
  } else {
    lastMs = ms;
    additional = 0;
    return ms * 1000;
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = false;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = fillOptionsWithDefaults;
function fillOptionsWithDefaults(options) {
  if (!options) options = {};
  options = JSON.parse(JSON.stringify(options)); // main

  if (typeof options.webWorkerSupport === 'undefined') options.webWorkerSupport = true; // indexed-db

  if (!options.idb) options.idb = {}; //  after this time the messages get deleted

  if (!options.idb.ttl) options.idb.ttl = 1000 * 45;
  if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150; // localstorage

  if (!options.localstorage) options.localstorage = {};
  if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 1000 * 60; // node

  if (!options.node) options.node = {};
  if (!options.node.ttl) options.node.ttl = 1000 * 60 * 2; // 2 minutes;

  if (typeof options.node.useFastPath === 'undefined') options.node.useFastPath = true;
  return options;
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export _removeTooOldValues */
/**
 *
 *
 */
var ObliviousSet = function ObliviousSet(ttl) {
  this.ttl = ttl;
  this.set = new Set();
  this.timeMap = new Map();
  this.has = this.set.has.bind(this.set);
};

ObliviousSet.prototype = {
  add: function add(value) {
    this.timeMap.set(value, now());
    this.set.add(value);

    _removeTooOldValues(this);
  },
  clear: function clear() {
    this.set.clear();
    this.timeMap.clear();
  }
};
function _removeTooOldValues(obliviousSet) {
  var olderThen = now() - obliviousSet.ttl;
  var iterator = obliviousSet.set[Symbol.iterator]();

  while (true) {
    var value = iterator.next().value;
    if (!value) return; // no more elements

    var time = obliviousSet.timeMap.get(value);

    if (time < olderThen) {
      obliviousSet.timeMap["delete"](value);
      obliviousSet.set["delete"](value);
    } else {
      // we reached a value that is not old enough
      return;
    }
  }
}

function now() {
  return new Date().getTime();
}

/* harmony default export */ __webpack_exports__["a"] = (ObliviousSet);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__method_chooser_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__options_js__ = __webpack_require__(2);




var BroadcastChannel = function BroadcastChannel(name, options) {
  this.name = name;
  this.options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__options_js__["a" /* fillOptionsWithDefaults */])(options);
  this.method = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__method_chooser_js__["a" /* chooseMethod */])(this.options); // isListening

  this._iL = false;
  /**
   * _onMessageListener
   * setting onmessage twice,
   * will overwrite the first listener
   */

  this._onML = null;
  /**
   * _addEventListeners
   */

  this._addEL = {
    message: [],
    internal: []
  };
  /**
   * _beforeClose
   * array of promises that will be awaited
   * before the channel is closed
   */

  this._befC = [];
  /**
   * _preparePromise
   */

  this._prepP = null;

  _prepareChannel(this);
}; // STATICS

/**
 * used to identify if someone overwrites
 * window.BroadcastChannel with this
 * See methods/native.js
 */


BroadcastChannel._pubkey = true;
/**
 * clears the tmp-folder if is node
 * @return {Promise<boolean>} true if has run, false if not node
 */

BroadcastChannel.clearNodeFolder = function (options) {
  options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__options_js__["a" /* fillOptionsWithDefaults */])(options);
  var method = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__method_chooser_js__["a" /* chooseMethod */])(options);

  if (method.type === 'node') {
    return method.clearNodeFolder().then(function () {
      return true;
    });
  } else {
    return Promise.resolve(false);
  }
}; // PROTOTYPE


BroadcastChannel.prototype = {
  postMessage: function postMessage(msg) {
    if (this.closed) {
      throw new Error('BroadcastChannel.postMessage(): ' + 'Cannot post message after channel has closed');
    }

    return _post(this, 'message', msg);
  },
  postInternal: function postInternal(msg) {
    return _post(this, 'internal', msg);
  },

  set onmessage(fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time: time,
      fn: fn
    };

    _removeListenerObject(this, 'message', this._onML);

    if (fn && typeof fn === 'function') {
      this._onML = listenObj;

      _addListenerObject(this, 'message', listenObj);
    } else {
      this._onML = null;
    }
  },

  addEventListener: function addEventListener(type, fn) {
    var time = this.method.microSeconds();
    var listenObj = {
      time: time,
      fn: fn
    };

    _addListenerObject(this, type, listenObj);
  },
  removeEventListener: function removeEventListener(type, fn) {
    var obj = this._addEL[type].find(function (obj) {
      return obj.fn === fn;
    });

    _removeListenerObject(this, type, obj);
  },
  close: function close() {
    var _this = this;

    if (this.closed) return;
    this.closed = true;
    var awaitPrepare = this._prepP ? this._prepP : Promise.resolve();
    this._onML = null;
    this._addEL.message = [];
    return awaitPrepare.then(function () {
      return Promise.all(_this._befC.map(function (fn) {
        return fn();
      }));
    }).then(function () {
      return _this.method.close(_this._state);
    });
  },

  get type() {
    return this.method.type;
  }

};

function _post(broadcastChannel, type, msg) {
  var time = broadcastChannel.method.microSeconds();
  var msgObj = {
    time: time,
    type: type,
    data: msg
  };
  var awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : Promise.resolve();
  return awaitPrepare.then(function () {
    return broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);
  });
}

function _prepareChannel(channel) {
  var maybePromise = channel.method.create(channel.name, channel.options);

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_js__["a" /* isPromise */])(maybePromise)) {
    channel._prepP = maybePromise;
    maybePromise.then(function (s) {
      // used in tests to simulate slow runtime

      /*if (channel.options.prepareDelay) {
           await new Promise(res => setTimeout(res, this.options.prepareDelay));
      }*/
      channel._state = s;
    });
  } else {
    channel._state = maybePromise;
  }
}

function _hasMessageListeners(channel) {
  if (channel._addEL.message.length > 0) return true;
  if (channel._addEL.internal.length > 0) return true;
  return false;
}

function _addListenerObject(channel, type, obj) {
  channel._addEL[type].push(obj);

  _startListening(channel);
}

function _removeListenerObject(channel, type, obj) {
  channel._addEL[type] = channel._addEL[type].filter(function (o) {
    return o !== obj;
  });

  _stopListening(channel);
}

function _startListening(channel) {
  if (!channel._iL && _hasMessageListeners(channel)) {
    // someone is listening, start subscribing
    var listenerFn = function listenerFn(msgObj) {
      channel._addEL[msgObj.type].forEach(function (obj) {
        if (msgObj.time >= obj.time) {
          obj.fn(msgObj.data);
        }
      });
    };

    var time = channel.method.microSeconds();

    if (channel._prepP) {
      channel._prepP.then(function () {
        channel._iL = true;
        channel.method.onMessage(channel._state, listenerFn, time);
      });
    } else {
      channel._iL = true;
      channel.method.onMessage(channel._state, listenerFn, time);
    }
  }
}

function _stopListening(channel) {
  if (channel._iL && !_hasMessageListeners(channel)) {
    // noone is listening, stop subscribing
    channel._iL = false;
    var time = channel.method.microSeconds();
    channel.method.onMessage(channel._state, null, time);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (BroadcastChannel);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initStateWithPrevTab = exports.withReduxStateSync = exports.createStateSyncMiddleware = undefined;
exports.generateUuidForAction = generateUuidForAction;
exports.isActionAllowed = isActionAllowed;
exports.createMessageListener = createMessageListener;

var _broadcastChannel = __webpack_require__(4);

var _broadcastChannel2 = _interopRequireDefault(_broadcastChannel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lastUuid = 0; /* eslint-env browser */

var GET_INIT_STATE = '&_GET_INIT_STATE';
var SEND_INIT_STATE = '&_SEND_INIT_STATE';
var RECEIVE_INIT_STATE = '&_RECEIVE_INIT_STATE';

var defaultConfig = {
  channel: 'redux_state_sync',
  initiateWithState: false,
  predicate: null,
  blacklist: [],
  whitelist: [],
  broadcastChannelOption: null
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

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function guid() {
  return '' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// generate current window unique id
var WINDOW_STATE_SYNC_ID = guid();
// if the message receiver is already created
var isMessageListenerCreated = false;
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
    allowed = function allowed(type) {
      return blacklist.indexOf(type) < 0;
    };
  } else if (Array.isArray(whitelist)) {
    allowed = function allowed(type) {
      return whitelist.indexOf(type) >= 0;
    };
  }
  return allowed;
}
// export for test
function createMessageListener(_ref2) {
  var channel = _ref2.channel,
      dispatch = _ref2.dispatch,
      allowed = _ref2.allowed;

  var isSynced = false;
  var tabs = {};
  var messageChannel = channel;
  messageChannel.onmessage = function (stampedAction) {
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

var createStateSyncMiddleware = exports.createStateSyncMiddleware = function createStateSyncMiddleware() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultConfig;

  var allowed = isActionAllowed(config);
  var channel = new _broadcastChannel2.default(config.channel, config.broadcastChannelOption);

  return function (_ref3) {
    var getState = _ref3.getState,
        dispatch = _ref3.dispatch;
    return function (next) {
      return function (action) {
        // create message receiver
        if (!isMessageListenerCreated) {
          isMessageListenerCreated = true;
          createMessageListener({ channel: channel, dispatch: dispatch, allowed: allowed });
        }
        // post messages
        if (action && !action.$uuid) {
          var stampedAction = generateUuidForAction(action);
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
  };
};

// init state with other tab's state
var withReduxStateSync = exports.withReduxStateSync = function withReduxStateSync(appReducer) {
  return function (state, action) {
    var initState = state;
    if (action.type === RECEIVE_INIT_STATE) {
      initState = action.payload;
    }
    return appReducer(initState, action);
  };
};

var initStateWithPrevTab = exports.initStateWithPrevTab = function initStateWithPrevTab(_ref4) {
  var dispatch = _ref4.dispatch;

  dispatch(getIniteState());
};

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = chooseMethod;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_detect_node__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__methods_native_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__methods_indexed_db_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__methods_localstorage_js__ = __webpack_require__(8);
var require;


 // order is important

var METHODS = [__WEBPACK_IMPORTED_MODULE_1__methods_native_js__["a" /* default */], // fastest
__WEBPACK_IMPORTED_MODULE_2__methods_indexed_db_js__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__methods_localstorage_js__["a" /* default */]];
var REQUIRE_FUN = require;
/**
 * The NodeMethod is loaded lazy
 * so it will not get bundled in browser-builds
 */

if (__WEBPACK_IMPORTED_MODULE_0_detect_node___default.a) {
  /**
   * we use the non-transpiled code for nodejs
   * because it runs faster
   */
  var NodeMethod = __webpack_require__(10);
  /**
   * this will be false for webpackbuilds
   * which will shim the node-method with an empty object {}
   */

  if (typeof NodeMethod.canBeUsed === 'function') {
    METHODS.push(NodeMethod);
  }
}

function chooseMethod(options) {
  // directly chosen
  if (options.type) {
    var ret = METHODS.find(function (m) {
      return m.type === options.type;
    });
    if (!ret) throw new Error('method-type ' + options.type + ' not found');else return ret;
  }

  var chooseMethods = METHODS;

  if (!options.webWorkerSupport && !__WEBPACK_IMPORTED_MODULE_0_detect_node___default.a) {
    // prefer localstorage over idb when no webworker-support needed
    chooseMethods = METHODS.filter(function (m) {
      return m.type !== 'idb';
    });
  }

  var useMethod = chooseMethods.find(function (method) {
    return method.canBeUsed();
  });
  if (!useMethod) throw new Error('No useable methode found:' + JSON.stringify(METHODS.map(function (m) {
    return m.type;
  })));else return useMethod;
}

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export microSeconds */
/* unused harmony export type */
/* unused harmony export getIdb */
/* unused harmony export createDatabase */
/* unused harmony export writeMessage */
/* unused harmony export getAllMessages */
/* unused harmony export getMessagesHigherThen */
/* unused harmony export removeMessageById */
/* unused harmony export getOldMessages */
/* unused harmony export cleanOldMessages */
/* unused harmony export create */
/* unused harmony export close */
/* unused harmony export postMessage */
/* unused harmony export onMessage */
/* unused harmony export canBeUsed */
/* unused harmony export averageResponseTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_detect_node__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__oblivious_set__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__options__ = __webpack_require__(2);
/**
 * this method uses indexeddb to store the messages
 * There is currently no observerAPI for idb
 * @link https://github.com/w3c/IndexedDB/issues/51
 */


var microSeconds = __WEBPACK_IMPORTED_MODULE_1__util_js__["b" /* microSeconds */];


var DB_PREFIX = 'pubkey.broadcast-channel-0-';
var OBJECT_STORE_ID = 'messages';
var type = 'idb';
function getIdb() {
  if (typeof indexedDB !== 'undefined') return indexedDB;
  if (typeof window.mozIndexedDB !== 'undefined') return window.mozIndexedDB;
  if (typeof window.webkitIndexedDB !== 'undefined') return window.webkitIndexedDB;
  if (typeof window.msIndexedDB !== 'undefined') return window.msIndexedDB;
  return false;
}
function createDatabase(channelName) {
  var IndexedDB = getIdb(); // create table

  var dbName = DB_PREFIX + channelName;
  var openRequest = IndexedDB.open(dbName, 1);

  openRequest.onupgradeneeded = function (ev) {
    var db = ev.target.result;
    db.createObjectStore(OBJECT_STORE_ID, {
      keyPath: 'id',
      autoIncrement: true
    });
  };

  var dbPromise = new Promise(function (res, rej) {
    openRequest.onerror = function (ev) {
      return rej(ev);
    };

    openRequest.onsuccess = function () {
      res(openRequest.result);
    };
  });
  return dbPromise;
}
/**
 * writes the new message to the database
 * so other readers can find it
 */

function writeMessage(db, readerUuid, messageJson) {
  var time = new Date().getTime();
  var writeObject = {
    uuid: readerUuid,
    time: time,
    data: messageJson
  };
  var transaction = db.transaction([OBJECT_STORE_ID], 'readwrite');
  return new Promise(function (res, rej) {
    transaction.oncomplete = function () {
      return res();
    };

    transaction.onerror = function (ev) {
      return rej(ev);
    };

    var objectStore = transaction.objectStore(OBJECT_STORE_ID);
    objectStore.add(writeObject);
  });
}
function getAllMessages(db) {
  var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function (res) {
    objectStore.openCursor().onsuccess = function (ev) {
      var cursor = ev.target.result;

      if (cursor) {
        ret.push(cursor.value); //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);

        cursor["continue"]();
      } else {
        res(ret);
      }
    };
  });
}
function getMessagesHigherThen(db, lastCursorId) {
  var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
  var ret = [];
  var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
  return new Promise(function (res) {
    objectStore.openCursor(keyRangeValue).onsuccess = function (ev) {
      var cursor = ev.target.result;

      if (cursor) {
        ret.push(cursor.value); //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);

        cursor["continue"]();
      } else {
        res(ret);
      }
    };
  });
}
function removeMessageById(db, id) {
  var request = db.transaction([OBJECT_STORE_ID], 'readwrite').objectStore(OBJECT_STORE_ID)["delete"](id);
  return new Promise(function (res) {
    request.onsuccess = function () {
      return res();
    };
  });
}
function getOldMessages(db, ttl) {
  var olderThen = new Date().getTime() - ttl;
  var objectStore = db.transaction(OBJECT_STORE_ID).objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function (res) {
    objectStore.openCursor().onsuccess = function (ev) {
      var cursor = ev.target.result;

      if (cursor) {
        var msgObk = cursor.value;

        if (msgObk.time < olderThen) {
          ret.push(msgObk); //alert("Name for SSN " + cursor.key + " is " + cursor.value.name);

          cursor["continue"]();
        } else {
          // no more old messages,
          res(ret);
          return;
        }
      } else {
        res(ret);
      }
    };
  });
}
function cleanOldMessages(db, ttl) {
  return getOldMessages(db, ttl).then(function (tooOld) {
    return Promise.all(tooOld.map(function (msgObj) {
      return removeMessageById(db, msgObj.id);
    }));
  });
}
function create(channelName, options) {
  options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__options__["a" /* fillOptionsWithDefaults */])(options);
  return createDatabase(channelName).then(function (db) {
    var state = {
      closed: false,
      lastCursorId: 0,
      channelName: channelName,
      options: options,
      uuid: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util_js__["d" /* randomToken */])(10),

      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new __WEBPACK_IMPORTED_MODULE_2__oblivious_set__["a" /* default */](options.idb.ttl * 2),
      // ensures we do not read messages in parrallel
      writeBlockPromise: Promise.resolve(),
      messagesCallback: null,
      readQueuePromises: [],
      db: db
    };
    /**
     * if service-workers are used,
     * we have no 'storage'-event if they post a message,
     * therefore we also have to set an interval
     */

    _readLoop(state);

    return state;
  });
}

function _readLoop(state) {
  if (state.closed) return;
  return readNewMessages(state).then(function () {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util_js__["c" /* sleep */])(state.options.idb.fallbackInterval);
  }).then(function () {
    return _readLoop(state);
  });
}

function _filterMessage(msgObj, state) {
  if (msgObj.uuid === state.uuid) return false; // send by own

  if (state.eMIs.has(msgObj.id)) return false; // already emitted

  if (msgObj.data.time < state.messagesCallbackTime) return false; // older then onMessageCallback

  return true;
}
/**
 * reads all new messages from the database and emits them
 */


function readNewMessages(state) {
  // channel already closed
  if (state.closed) return Promise.resolve(); // if no one is listening, we do not need to scan for new messages

  if (!state.messagesCallback) return Promise.resolve();
  return getMessagesHigherThen(state.db, state.lastCursorId).then(function (newerMessages) {
    var useMessages = newerMessages.map(function (msgObj) {
      if (msgObj.id > state.lastCursorId) {
        state.lastCursorId = msgObj.id;
      }

      return msgObj;
    }).filter(function (msgObj) {
      return _filterMessage(msgObj, state);
    }).sort(function (msgObjA, msgObjB) {
      return msgObjA.time - msgObjB.time;
    }); // sort by time

    useMessages.forEach(function (msgObj) {
      if (state.messagesCallback) {
        state.eMIs.add(msgObj.id);
        state.messagesCallback(msgObj.data);
      }
    });
    return Promise.resolve();
  });
}

function close(channelState) {
  channelState.closed = true;
  channelState.db.close();
}
function postMessage(channelState, messageJson) {
  channelState.writeBlockPromise = channelState.writeBlockPromise.then(function () {
    return writeMessage(channelState.db, channelState.uuid, messageJson);
  }).then(function () {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util_js__["e" /* randomInt */])(0, 10) === 0) {
      /* await (do not await) */
      cleanOldMessages(channelState.db, channelState.options.idb.ttl);
    }
  });
  return channelState.writeBlockPromise;
}
function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
  readNewMessages(channelState);
}
function canBeUsed() {
  if (__WEBPACK_IMPORTED_MODULE_0_detect_node___default.a) return false;
  var idb = getIdb();
  if (!idb) return false;
  return true;
}
function averageResponseTime(options) {
  return options.idb.fallbackInterval * 2;
}
/* harmony default export */ __webpack_exports__["a"] = ({
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
});

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export microSeconds */
/* unused harmony export type */
/* unused harmony export getLocalStorage */
/* unused harmony export storageKey */
/* unused harmony export postMessage */
/* unused harmony export addStorageEventListener */
/* unused harmony export removeStorageEventListener */
/* unused harmony export create */
/* unused harmony export close */
/* unused harmony export onMessage */
/* unused harmony export canBeUsed */
/* unused harmony export averageResponseTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_detect_node__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__oblivious_set__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__options__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(0);
/**
 * A localStorage-only method which uses localstorage and its 'storage'-event
 * This does not work inside of webworkers because they have no access to locastorage
 * This is basically implemented to support IE9 or your grandmothers toaster.
 * @link https://caniuse.com/#feat=namevalue-storage
 * @link https://caniuse.com/#feat=indexeddb
 */




var microSeconds = __WEBPACK_IMPORTED_MODULE_3__util__["b" /* microSeconds */];
var KEY_PREFIX = 'pubkey.broadcastChannel-';
var type = 'localstorage';
/**
 * copied from crosstab
 * @link https://github.com/tejacques/crosstab/blob/master/src/crosstab.js#L32
 */

function getLocalStorage() {
  var localStorage;
  if (typeof window === 'undefined') return null;

  try {
    localStorage = window.localStorage;
    localStorage = window['ie8-eventlistener/storage'] || window.localStorage;
  } catch (e) {// New versions of Firefox throw a Security exception
    // if cookies are disabled. See
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1028153
  }

  return localStorage;
}
function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}
/**
* writes the new message to the storage
* and fires the storage-event so other readers can find it
*/

function postMessage(channelState, messageJson) {
  return new Promise(function (res) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__["c" /* sleep */])().then(function () {
      var key = storageKey(channelState.channelName);
      var writeObj = {
        token: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__["d" /* randomToken */])(10),
        time: new Date().getTime(),
        data: messageJson,
        uuid: channelState.uuid
      };
      var value = JSON.stringify(writeObj);
      localStorage.setItem(key, value);
      /**
       * StorageEvent does not fire the 'storage' event
       * in the window that changes the state of the local storage.
       * So we fire it manually
       */

      var ev = document.createEvent('Event');
      ev.initEvent('storage', true, true);
      ev.key = key;
      ev.newValue = value;
      window.dispatchEvent(ev);
      res();
    });
  });
}
function addStorageEventListener(channelName, fn) {
  var key = storageKey(channelName);

  var listener = function listener(ev) {
    if (ev.key === key) {
      fn(JSON.parse(ev.newValue));
    }
  };

  window.addEventListener('storage', listener);
  return listener;
}
function removeStorageEventListener(listener) {
  window.removeEventListener('storage', listener);
}
function create(channelName, options) {
  options = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__options__["a" /* fillOptionsWithDefaults */])(options);

  if (!canBeUsed()) {
    throw new Error('BroadcastChannel: localstorage cannot be used');
  }

  var uuid = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__["d" /* randomToken */])(10);
  /**
   * eMIs
   * contains all messages that have been emitted before
   * @type {ObliviousSet}
   */

  var eMIs = new __WEBPACK_IMPORTED_MODULE_1__oblivious_set__["a" /* default */](options.localstorage.removeTimeout);
  var state = {
    channelName: channelName,
    uuid: uuid,
    eMIs: eMIs // emittedMessagesIds

  };
  state.listener = addStorageEventListener(channelName, function (msgObj) {
    if (!state.messagesCallback) return; // no listener

    if (msgObj.uuid === uuid) return; // own message

    if (!msgObj.token || eMIs.has(msgObj.token)) return; // already emitted

    if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return; // too old

    eMIs.add(msgObj.token);
    state.messagesCallback(msgObj.data);
  });
  return state;
}
function close(channelState) {
  removeStorageEventListener(channelState.listener);
}
function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  if (__WEBPACK_IMPORTED_MODULE_0_detect_node___default.a) return false;
  var ls = getLocalStorage();
  if (!ls) return false;
  return true;
}
function averageResponseTime() {
  return 120;
}
/* harmony default export */ __webpack_exports__["a"] = ({
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
});

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export microSeconds */
/* unused harmony export type */
/* unused harmony export create */
/* unused harmony export close */
/* unused harmony export postMessage */
/* unused harmony export onMessage */
/* unused harmony export canBeUsed */
/* unused harmony export averageResponseTime */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_detect_node__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(0);


var microSeconds = __WEBPACK_IMPORTED_MODULE_1__util__["b" /* microSeconds */];
var type = 'native';
function create(channelName) {
  var state = {
    messagesCallback: null,
    bc: new BroadcastChannel(channelName),
    subFns: [] // subscriberFunctions

  };

  state.bc.onmessage = function (msg) {
    if (state.messagesCallback) {
      state.messagesCallback(msg.data);
    }
  };

  return state;
}
function close(channelState) {
  channelState.bc.close();
  channelState.subFns = [];
}
function postMessage(channelState, messageJson) {
  channelState.bc.postMessage(messageJson, false);
}
function onMessage(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  /**
   * in the electron-renderer, isNode will be true even if we are in browser-context
   * so we also check if window is undefined
   */
  if (__WEBPACK_IMPORTED_MODULE_0_detect_node___default.a && typeof window === 'undefined') return false;

  if (typeof BroadcastChannel === 'function') {
    if (BroadcastChannel._pubkey) {
      throw new Error('BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill');
    }

    return true;
  } else return false;
}
function averageResponseTime() {
  return 100;
}
/* harmony default export */ __webpack_exports__["a"] = ({
  create: create,
  close: close,
  onMessage: onMessage,
  postMessage: postMessage,
  canBeUsed: canBeUsed,
  type: type,
  averageResponseTime: averageResponseTime,
  microSeconds: microSeconds
});

/***/ }),
/* 10 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
/******/ ]);
});
//# sourceMappingURL=syncStorage.umd.js.map