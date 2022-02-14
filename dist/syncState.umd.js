!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.reduxStateSync=t():e.reduxStateSync=t()}(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t,n){"use strict";(function(e){function r(e){return!(!e||"function"!=typeof e.then)}function o(e){return e||(e=0),new Promise((function(t){return setTimeout(t,e)}))}function i(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function a(){return Math.random().toString(36).substring(2)}n.d(t,"b",(function(){return r})),n.d(t,"f",(function(){return o})),n.d(t,"d",(function(){return i})),n.d(t,"e",(function(){return a})),n.d(t,"c",(function(){return c})),n.d(t,"a",(function(){return l}));var s=0,u=0;function c(){var e=(new Date).getTime();return e===s?1e3*e+ ++u:(s=e,u=0,1e3*e)}var l="[object process]"===Object.prototype.toString.call(void 0!==e?e:0)}).call(this,n(4))},function(e,t){e.exports=!1},function(e,t){},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initMessageListener=t.initStateWithPrevTab=t.withReduxStateSync=t.createReduxStateSync=t.createStateSyncMiddleware=t.WINDOW_STATE_SYNC_ID=t.INIT_MESSAGE_LISTENER=t.RECEIVE_INIT_STATE=t.SEND_INIT_STATE=t.GET_INIT_STATE=void 0,t.generateUuidForAction=h,t.isActionAllowed=p,t.isActionSynced=function(e){return!!e.$isSync},t.MessageListener=m;var r=n(6),o=0,i=t.GET_INIT_STATE="&_GET_INIT_STATE",a=t.SEND_INIT_STATE="&_SEND_INIT_STATE",s=t.RECEIVE_INIT_STATE="&_RECEIVE_INIT_STATE",u=t.INIT_MESSAGE_LISTENER="&_INIT_MESSAGE_LISTENER",c={channel:"redux_state_sync",predicate:null,blacklist:[],whitelist:[],broadcastChannelOption:void 0,prepareState:function(e){return e}};function l(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}function d(){return""+l()+l()+"-"+l()+"-"+l()+"-"+l()+"-"+l()+l()+l()}var f=t.WINDOW_STATE_SYNC_ID=d();function h(e){var t=e;return t.$uuid=d(),t.$wuid=f,t}function p(e){var t=e.predicate,n=e.blacklist,r=e.whitelist,o=function(){return!0};return t&&"function"==typeof t?o=t:Array.isArray(n)?o=function(e){return n.indexOf(e.type)<0}:Array.isArray(r)&&(o=function(e){return r.indexOf(e.type)>=0}),o}function m(e){var t=e.channel,n=e.dispatch,r=e.allowed,u=!1,c={};this.handleOnMessage=function(e){var t;e.$wuid!==f&&(e.type!==s&&e.$uuid&&e.$uuid!==o&&(e.type!==i||c[e.$wuid]?e.type!==a||c[e.$wuid]?r(e)&&(o=e.$uuid,n(Object.assign(e,{$isSync:!0}))):u||(u=!0,n((t=e.payload,{type:s,payload:t}))):(c[e.$wuid]=!0,n({type:a}))))},this.messageChannel=t,this.messageChannel.onmessage=this.handleOnMessage}t.createStateSyncMiddleware=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c,t=p(e),n=new r.BroadcastChannel(e.channel,e.broadcastChannelOption),s=e.prepareState||c.prepareState,u=null;return function(e){var r=e.getState,c=e.dispatch;return function(e){return function(l){if(u||(u=new m({channel:n,dispatch:c,allowed:t})),l&&!l.$uuid){var d=h(l);o=d.$uuid;try{if(l.type===a)return r()&&(d.payload=s(r()),n.postMessage(d)),e(l);(t(d)||l.type===i)&&n.postMessage(d)}catch(e){console.error("Your browser doesn't support cross tab communication")}}return e(Object.assign(l,{$isSync:void 0!==l.$isSync&&l.$isSync}))}}}};var v=t.createReduxStateSync=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c.prepareState;return function(n,r){var o=n;return r.type===s&&(o=t(n,r.payload)),e(o,r)}};t.withReduxStateSync=v,t.initStateWithPrevTab=function(e){(0,e.dispatch)({type:i})},t.initMessageListener=function(e){(0,e.dispatch)({type:u})}},function(e,t){var n,r,o=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function s(e){if(n===setTimeout)return setTimeout(e,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(e,0);try{return n(e,0)}catch(t){try{return n.call(null,e,0)}catch(t){return n.call(this,e,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:i}catch(e){n=i}try{r="function"==typeof clearTimeout?clearTimeout:a}catch(e){r=a}}();var u,c=[],l=!1,d=-1;function f(){l&&u&&(l=!1,u.length?c=u.concat(c):d=-1,c.length&&h())}function h(){if(!l){var e=s(f);l=!0;for(var t=c.length;t;){for(u=c,c=[];++d<t;)u&&u[d].run();d=-1,t=c.length}u=null,l=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===a||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function p(e,t){this.fun=e,this.array=t}function m(){}o.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];c.push(new p(e,t)),1!==c.length||l||s(h)},p.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=m,o.addListener=m,o.once=m,o.off=m,o.removeListener=m,o.removeAllListeners=m,o.emit=m,o.prependListener=m,o.prependOnceListener=m,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(e,t){},function(e,t,n){"use strict";n.r(t),n.d(t,"BroadcastChannel",(function(){return L})),n.d(t,"clearNodeFolder",(function(){return k})),n.d(t,"enforceOptions",(function(){return P})),n.d(t,"createLeaderElection",(function(){return z})),n.d(t,"beLeader",(function(){return V}));var r=n(0);var o={create:function(e){var t={messagesCallback:null,bc:new BroadcastChannel(e),subFns:[]};return t.bc.onmessage=function(e){t.messagesCallback&&t.messagesCallback(e.data)},t},close:function(e){e.bc.close(),e.subFns=[]},onMessage:function(e,t){e.messagesCallback=t},postMessage:function(e,t){try{return e.bc.postMessage(t,!1),Promise.resolve()}catch(e){return Promise.reject(e)}},canBeUsed:function(){if(r.a&&"undefined"==typeof window)return!1;if("function"==typeof BroadcastChannel){if(BroadcastChannel._pubkey)throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");return!0}return!1},type:"native",averageResponseTime:function(){return 150},microSeconds:r.c},i=function(){function e(e){this.ttl=e,this.set=new Set,this.timeMap=new Map}return e.prototype.has=function(e){return this.set.has(e)},e.prototype.add=function(e){var t=this;this.timeMap.set(e,a()),this.set.add(e),setTimeout((function(){!function(e){var t=a()-e.ttl,n=e.set[Symbol.iterator]();for(;;){var r=n.next().value;if(!r)return;if(!(e.timeMap.get(r)<t))return;e.timeMap.delete(r),e.set.delete(r)}}(t)}),0)},e.prototype.clear=function(){this.set.clear(),this.timeMap.clear()},e}();function a(){return(new Date).getTime()}function s(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=JSON.parse(JSON.stringify(e));return void 0===t.webWorkerSupport&&(t.webWorkerSupport=!0),t.idb||(t.idb={}),t.idb.ttl||(t.idb.ttl=45e3),t.idb.fallbackInterval||(t.idb.fallbackInterval=150),e.idb&&"function"==typeof e.idb.onclose&&(t.idb.onclose=e.idb.onclose),t.localstorage||(t.localstorage={}),t.localstorage.removeTimeout||(t.localstorage.removeTimeout=6e4),e.methods&&(t.methods=e.methods),t.node||(t.node={}),t.node.ttl||(t.node.ttl=12e4),void 0===t.node.useFastPath&&(t.node.useFastPath=!0),t}var u=r.c;function c(){if("undefined"!=typeof indexedDB)return indexedDB;if("undefined"!=typeof window){if(void 0!==window.mozIndexedDB)return window.mozIndexedDB;if(void 0!==window.webkitIndexedDB)return window.webkitIndexedDB;if(void 0!==window.msIndexedDB)return window.msIndexedDB}return!1}function l(e,t){var n=e.transaction("messages").objectStore("messages"),r=[];return new Promise((function(e){(function(){try{var e=IDBKeyRange.bound(t+1,1/0);return n.openCursor(e)}catch(e){return n.openCursor()}}()).onsuccess=function(n){var o=n.target.result;o?o.value.id<t+1?o.continue(t+1):(r.push(o.value),o.continue()):e(r)}}))}function d(e,t){return function(e,t){var n=(new Date).getTime()-t,r=e.transaction("messages").objectStore("messages"),o=[];return new Promise((function(e){r.openCursor().onsuccess=function(t){var r=t.target.result;if(r){var i=r.value;if(!(i.time<n))return void e(o);o.push(i),r.continue()}else e(o)}}))}(e,t).then((function(t){return Promise.all(t.map((function(t){return function(e,t){var n=e.transaction(["messages"],"readwrite").objectStore("messages").delete(t);return new Promise((function(e){n.onsuccess=function(){return e()}}))}(e,t.id)})))}))}function f(e){return e.closed?Promise.resolve():e.messagesCallback?l(e.db,e.lastCursorId).then((function(t){return t.filter((function(e){return!!e})).map((function(t){return t.id>e.lastCursorId&&(e.lastCursorId=t.id),t})).filter((function(t){return function(e,t){return e.uuid!==t.uuid&&(!t.eMIs.has(e.id)&&!(e.data.time<t.messagesCallbackTime))}(t,e)})).sort((function(e,t){return e.time-t.time})).forEach((function(t){e.messagesCallback&&(e.eMIs.add(t.id),e.messagesCallback(t.data))})),Promise.resolve()})):Promise.resolve()}var h={create:function(e,t){return t=s(t),function(e){var t="pubkey.broadcast-channel-0-"+e,n=c().open(t,1);return n.onupgradeneeded=function(e){e.target.result.createObjectStore("messages",{keyPath:"id",autoIncrement:!0})},new Promise((function(e,t){n.onerror=function(e){return t(e)},n.onsuccess=function(){e(n.result)}}))}(e).then((function(n){var o={closed:!1,lastCursorId:0,channelName:e,options:t,uuid:Object(r.e)(),eMIs:new i(2*t.idb.ttl),writeBlockPromise:Promise.resolve(),messagesCallback:null,readQueuePromises:[],db:n};return n.onclose=function(){o.closed=!0,t.idb.onclose&&t.idb.onclose()},function e(t){if(t.closed)return;f(t).then((function(){return Object(r.f)(t.options.idb.fallbackInterval)})).then((function(){return e(t)}))}(o),o}))},close:function(e){e.closed=!0,e.db.close()},onMessage:function(e,t,n){e.messagesCallbackTime=n,e.messagesCallback=t,f(e)},postMessage:function(e,t){return e.writeBlockPromise=e.writeBlockPromise.then((function(){return function(e,t,n){var r={uuid:t,time:(new Date).getTime(),data:n},o=e.transaction(["messages"],"readwrite");return new Promise((function(e,t){o.oncomplete=function(){return e()},o.onerror=function(e){return t(e)},o.objectStore("messages").add(r)}))}(e.db,e.uuid,t)})).then((function(){0===Object(r.d)(0,10)&&d(e.db,e.options.idb.ttl)})),e.writeBlockPromise},canBeUsed:function(){return!r.a&&!!c()},type:"idb",averageResponseTime:function(e){return 2*e.idb.fallbackInterval},microSeconds:u},p=r.c;function m(){var e;if("undefined"==typeof window)return null;try{e=window.localStorage,e=window["ie8-eventlistener/storage"]||window.localStorage}catch(e){}return e}function v(e){return"pubkey.broadcastChannel-"+e}function y(){if(r.a)return!1;var e=m();if(!e)return!1;try{var t="__broadcastchannel_check";e.setItem(t,"works"),e.removeItem(t)}catch(e){return!1}return!0}var b={create:function(e,t){if(t=s(t),!y())throw new Error("BroadcastChannel: localstorage cannot be used");var n=Object(r.e)(),o=new i(t.localstorage.removeTimeout),a={channelName:e,uuid:n,eMIs:o};return a.listener=function(e,t){var n=v(e),r=function(e){e.key===n&&t(JSON.parse(e.newValue))};return window.addEventListener("storage",r),r}(e,(function(e){a.messagesCallback&&e.uuid!==n&&e.token&&!o.has(e.token)&&(e.data.time&&e.data.time<a.messagesCallbackTime||(o.add(e.token),a.messagesCallback(e.data)))})),a},close:function(e){var t;t=e.listener,window.removeEventListener("storage",t)},onMessage:function(e,t,n){e.messagesCallbackTime=n,e.messagesCallback=t},postMessage:function(e,t){return new Promise((function(n){Object(r.f)().then((function(){var o=v(e.channelName),i={token:Object(r.e)(),time:(new Date).getTime(),data:t,uuid:e.uuid},a=JSON.stringify(i);m().setItem(o,a);var s=document.createEvent("Event");s.initEvent("storage",!0,!0),s.key=o,s.newValue=a,window.dispatchEvent(s),n()}))}))},canBeUsed:y,type:"localstorage",averageResponseTime:function(){var e=navigator.userAgent.toLowerCase();return e.includes("safari")&&!e.includes("chrome")?240:120},microSeconds:p},g=r.c,_=new Set;var w={create:function(e){var t={name:e,messagesCallback:null};return _.add(t),t},close:function(e){_.delete(e)},onMessage:function(e,t){e.messagesCallback=t},postMessage:function(e,t){return new Promise((function(n){return setTimeout((function(){Array.from(_).filter((function(t){return t.name===e.name})).filter((function(t){return t!==e})).filter((function(e){return!!e.messagesCallback})).forEach((function(e){return e.messagesCallback(t)})),n()}),5)}))},canBeUsed:function(){return!0},type:"simulate",averageResponseTime:function(){return 5},microSeconds:g},S=[o,h,b];if(r.a){var E=n(5);"function"==typeof E.canBeUsed&&S.push(E)}function T(e){var t=[].concat(e.methods,S).filter(Boolean);if(e.type){if("simulate"===e.type)return w;var n=t.find((function(t){return t.type===e.type}));if(n)return n;throw new Error("method-type "+e.type+" not found")}e.webWorkerSupport||r.a||(t=t.filter((function(e){return"idb"!==e.type})));var o=t.find((function(e){return e.canBeUsed()}));if(o)return o;throw new Error("No useable methode found:"+JSON.stringify(S.map((function(e){return e.type}))))}var I,L=function(e,t){var n,o;this.name=e,I&&(t=I),this.options=s(t),this.method=T(this.options),this._iL=!1,this._onML=null,this._addEL={message:[],internal:[]},this._uMP=new Set,this._befC=[],this._prepP=null,o=(n=this).method.create(n.name,n.options),Object(r.b)(o)?(n._prepP=o,o.then((function(e){n._state=e}))):n._state=o};function k(e){var t=T(e=s(e));return"node"===t.type?t.clearNodeFolder().then((function(){return!0})):Promise.resolve(!1)}function P(e){I=e}function C(e,t,n){var r={time:e.method.microSeconds(),type:t,data:n};return(e._prepP?e._prepP:Promise.resolve()).then((function(){var t=e.method.postMessage(e._state,r);return e._uMP.add(t),t.catch().then((function(){return e._uMP.delete(t)})),t}))}function M(e){return e._addEL.message.length>0||e._addEL.internal.length>0}function O(e,t,n){e._addEL[t].push(n),function(e){if(!e._iL&&M(e)){var t=function(t){e._addEL[t.type].forEach((function(e){t.time>=e.time&&e.fn(t.data)}))},n=e.method.microSeconds();e._prepP?e._prepP.then((function(){e._iL=!0,e.method.onMessage(e._state,t,n)})):(e._iL=!0,e.method.onMessage(e._state,t,n))}}(e)}function A(e,t,n){e._addEL[t]=e._addEL[t].filter((function(e){return e!==n})),function(e){if(e._iL&&!M(e)){e._iL=!1;var t=e.method.microSeconds();e.method.onMessage(e._state,null,t)}}(e)}L._pubkey=!0,L.prototype={postMessage:function(e){if(this.closed)throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed");return C(this,"message",e)},postInternal:function(e){return C(this,"internal",e)},set onmessage(e){var t={time:this.method.microSeconds(),fn:e};A(this,"message",this._onML),e&&"function"==typeof e?(this._onML=t,O(this,"message",t)):this._onML=null},addEventListener:function(e,t){O(this,e,{time:this.method.microSeconds(),fn:t})},removeEventListener:function(e,t){A(this,e,this._addEL[e].find((function(e){return e.fn===t})))},close:function(){var e=this;if(!this.closed){this.closed=!0;var t=this._prepP?this._prepP:Promise.resolve();return this._onML=null,this._addEL.message=[],t.then((function(){return Promise.all(Array.from(e._uMP))})).then((function(){return Promise.all(e._befC.map((function(e){return e()})))})).then((function(){return e.method.close(e._state)}))}},get type(){return this.method.type},get isClosed(){return this.closed}};var x=n(1),N=n.n(x);var j={add:function(e){if("function"==typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope);else{if("function"!=typeof window.addEventListener)return;window.addEventListener("beforeunload",(function(){e()}),!0),window.addEventListener("unload",(function(){e()}),!0)}}},B=n(2),D=n.n(B),R=N.a?D.a:j,$=new Set,W=!1;function G(){var e=[];return $.forEach((function(t){e.push(t()),$.delete(t)})),Promise.all(e)}var F={add:function(e){if(W||(W=!0,R.add(G)),"function"!=typeof e)throw new Error("Listener is no function");return $.add(e),{remove:function(){return $.delete(e)},run:function(){return $.delete(e),e()}}},runAll:G,removeAll:function(){$.clear()},getSize:function(){return $.size}},J=function(e,t){this._channel=e,this._options=t,this.isLeader=!1,this.isDead=!1,this.token=Object(r.e)(),this._isApl=!1,this._reApply=!1,this._unl=[],this._lstns=[],this._invs=[],this._dpL=function(){},this._dpLC=!1};function U(e,t){var n={context:"leader",action:t,token:e.token};return e._channel.postInternal(n)}function V(e){e.isLeader=!0;var t=F.add((function(){return e.die()}));e._unl.push(t);var n=function(t){"leader"===t.context&&"apply"===t.action&&U(e,"tell"),"leader"!==t.context||"tell"!==t.action||e._dpLC||(e._dpLC=!0,e._dpL(),U(e,"tell"))};return e._channel.addEventListener("internal",n),e._lstns.push(n),U(e,"tell")}function z(e,t){if(e._leaderElector)throw new Error("BroadcastChannel already has a leader-elector");t=function(e,t){return e||(e={}),(e=JSON.parse(JSON.stringify(e))).fallbackInterval||(e.fallbackInterval=3e3),e.responseTime||(e.responseTime=t.method.averageResponseTime(t.options)),e}(t,e);var n=new J(e,t);return e._befC.push((function(){return n.die()})),e._leaderElector=n,n}J.prototype={applyOnce:function(){var e=this;if(this.isLeader)return Promise.resolve(!1);if(this.isDead)return Promise.resolve(!1);if(this._isApl)return this._reApply=!0,Promise.resolve(!1);this._isApl=!0;var t=!1,n=[],o=function(r){"leader"===r.context&&r.token!=e.token&&(n.push(r),"apply"===r.action&&r.token>e.token&&(t=!0),"tell"===r.action&&(t=!0))};return this._channel.addEventListener("internal",o),U(this,"apply").then((function(){return Object(r.f)(e._options.responseTime)})).then((function(){return t?Promise.reject(new Error):U(e,"apply")})).then((function(){return Object(r.f)(e._options.responseTime)})).then((function(){return t?Promise.reject(new Error):U(e)})).then((function(){return V(e)})).then((function(){return!0})).catch((function(){return!1})).then((function(t){return e._channel.removeEventListener("internal",o),e._isApl=!1,!t&&e._reApply?(e._reApply=!1,e.applyOnce()):t}))},awaitLeadership:function(){var e;return this._aLP||(this._aLP=(e=this).isLeader?Promise.resolve():new Promise((function(t){var n=!1;function r(){n||(n=!0,clearInterval(o),e._channel.removeEventListener("internal",i),t(!0))}e.applyOnce().then((function(){e.isLeader&&r()}));var o=setInterval((function(){e.applyOnce().then((function(){e.isLeader&&r()}))}),e._options.fallbackInterval);e._invs.push(o);var i=function(t){"leader"===t.context&&"death"===t.action&&e.applyOnce().then((function(){e.isLeader&&r()}))};e._channel.addEventListener("internal",i),e._lstns.push(i)}))),this._aLP},set onduplicate(e){this._dpL=e},die:function(){var e=this;if(!this.isDead)return this.isDead=!0,this._lstns.forEach((function(t){return e._channel.removeEventListener("internal",t)})),this._invs.forEach((function(e){return clearInterval(e)})),this._unl.forEach((function(e){e.remove()})),U(this,"death")}}}])}));
//# sourceMappingURL=syncState.umd.js.map