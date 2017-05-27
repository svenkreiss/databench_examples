/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	/* global document */
	Object.defineProperty(exports, "__esModule", { value: true });
	var Databench = __webpack_require__(1);
	// initialize Databench's frontend library
	var databench = new Databench.Connection();
	Databench.ui.wire(databench);
	// listen for updates to 'status' in 'data'
	databench.on({ data: 'status' }, function (status) {
	    console.log("received " + JSON.stringify(status));
	    document.getElementById('status').innerHTML = status;
	});
	databench.connect();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Databench
	 */
	"use strict";
	var connection_1 = __webpack_require__(2);
	exports.Connection = connection_1.Connection;
	var ui = __webpack_require__(6);
	exports.ui = ui;
	//# sourceMappingURL=index.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var websocket_1 = __webpack_require__(3);
	/**
	 * Connection to the backend.
	 *
	 * The standard template is to create a connection first, then use it to
	 * wire all UI elements, to add custom callback functions and at last to run
	 * {@link Connection#connect|connect()} to create a WebSocket connection to the backend
	 * server (see example below).
	 *
	 * The other two essential functions to know about are
	 * {@link Connection#on|on()} and {@link Connection#emit|emit()}.
	 *
	 * @example
	 * ~~~
	 * var d = new Databench.Connection();
	 * Databench.ui.wire(d);
	 * // put custom d.on() methods here
	 * d.connect();
	 * ~~~
	 */
	var Connection = (function () {
	    /**
	     * @param  {String} [analysisId=null]  Specify an analysis id or null to have one generated.
	     *                                     The connection will try to connect to a previously created
	     *                                     analysis with that id.
	     * @param  {String} [wsUrl=null]       URL of WebSocket endpoint or null to guess it.
	     * @param  {String} [requestArgs=null] `search` part of request url or null to take from
	     *                                     `window.location.search`.
	     */
	    function Connection(analysisId, wsUrl, requestArgs) {
	        if (analysisId === void 0) { analysisId = null; }
	        if (wsUrl === void 0) { wsUrl = null; }
	        if (requestArgs === void 0) { requestArgs = null; }
	        this.analysisId = analysisId;
	        this.wsUrl = wsUrl || Connection.guessWSUrl();
	        this.requestArgs = (requestArgs == null && (typeof window !== 'undefined')) ?
	            window.location.search : requestArgs;
	        if (!this.wsUrl) {
	            throw Error('Need a wsUrl.');
	        }
	        this.errorCB = function (msg) { return (msg != null ? console.log("connection error: " + msg) : null); };
	        this.onCallbacks = [];
	        this._onCallbacksOptimized = null;
	        this.onProcessCallbacks = {};
	        this.wsReconnectAttempt = 0;
	        this.wsReconnectDelay = 100.0;
	        this.socket = null;
	        this.socketCheckOpen = null;
	    }
	    Connection.guessWSUrl = function () {
	        if (typeof location === 'undefined')
	            return null;
	        var WSProtocol = location.origin.indexOf('https://') === 0 ? 'wss' : 'ws';
	        var path = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
	        return WSProtocol + "://" + document.domain + ":" + location.port + path + "/ws";
	    };
	    /** initialize connection */
	    Connection.prototype.connect = function () {
	        this.socket = new websocket_1.w3cwebsocket(this.wsUrl);
	        this.socketCheckOpen = setInterval(this.wsCheckOpen.bind(this), 2000);
	        this.socket.onopen = this.wsOnOpen.bind(this);
	        this.socket.onclose = this.wsOnClose.bind(this);
	        this.socket.onmessage = this.wsOnMessage.bind(this);
	        return this;
	    };
	    /** close connection */
	    Connection.prototype.disconnect = function () {
	        this.socket.onclose = null;
	        this.socket.close();
	        this.socket = null;
	    };
	    Connection.prototype.wsCheckOpen = function () {
	        if (this.socket.readyState === this.socket.CONNECTING) {
	            return;
	        }
	        if (this.socket.readyState !== this.socket.OPEN) {
	            this.errorCB('Connection could not be opened. ' +
	                'Please <a href="javascript:location.reload(true);" ' +
	                'class="alert-link">reload</a> this page to try again.');
	        }
	        clearInterval(this.socketCheckOpen);
	    };
	    Connection.prototype.wsOnOpen = function () {
	        this.wsReconnectAttempt = 0;
	        this.wsReconnectDelay = 100.0;
	        this.errorCB(); // clear errors
	        this.socket.send(JSON.stringify({
	            __connect: this.analysisId,
	            __request_args: this.requestArgs,
	        }));
	    };
	    Connection.prototype.wsOnClose = function () {
	        clearInterval(this.socketCheckOpen);
	        this.wsReconnectAttempt += 1;
	        this.wsReconnectDelay *= 2;
	        if (this.wsReconnectAttempt > 3) {
	            this.errorCB('Connection closed. ' +
	                'Please <a href="javascript:location.reload(true);" ' +
	                'class="alert-link">reload</a> this page to reconnect.');
	            return;
	        }
	        var actualDelay = 0.7 * this.wsReconnectDelay + 0.3 * Math.random() *
	            this.wsReconnectDelay;
	        console.log("WebSocket reconnect attempt " + this.wsReconnectAttempt + " " +
	            ("in " + actualDelay.toFixed(0) + "ms."));
	        setTimeout(this.connect.bind(this), actualDelay);
	    };
	    Connection.prototype.wsOnMessage = function (event) {
	        var message = JSON.parse(event.data);
	        // connect response
	        if (message.signal === '__connect') {
	            this.analysisId = message.load.analysis_id;
	        }
	        // processes
	        if (message.signal === '__process') {
	            var id = message.load.id;
	            var status_1 = message.load.status;
	            this.onProcessCallbacks[id].map(function (cb) { return cb(status_1); });
	        }
	        // normal message
	        if (this._onCallbacksOptimized === null)
	            this.optimizeOnCallbacks();
	        if (message.signal in this._onCallbacksOptimized) {
	            this._onCallbacksOptimized[message.signal].map(function (cb) { return cb(message.load); });
	        }
	    };
	    Connection.prototype.optimizeOnCallbacks = function () {
	        var _this = this;
	        this._onCallbacksOptimized = {};
	        this.onCallbacks.forEach(function (_a) {
	            var signal = _a.signal, callback = _a.callback;
	            if (typeof signal === 'string') {
	                if (!(signal in _this._onCallbacksOptimized)) {
	                    _this._onCallbacksOptimized[signal] = [];
	                }
	                _this._onCallbacksOptimized[signal].push(callback);
	            }
	            else if (typeof signal === 'object') {
	                Object.keys(signal).forEach(function (signalName) {
	                    var entryName = signal[signalName];
	                    var filteredCallback = function (data) {
	                        if (data.hasOwnProperty(entryName)) {
	                            callback(data[entryName]);
	                        }
	                    };
	                    if (!(signalName in _this._onCallbacksOptimized)) {
	                        _this._onCallbacksOptimized[signalName] = [];
	                    }
	                    // only use the filtered callback if the entry was not empty
	                    if (entryName) {
	                        _this._onCallbacksOptimized[signalName].push(filteredCallback);
	                    }
	                    else {
	                        _this._onCallbacksOptimized[signalName].push(callback);
	                    }
	                });
	            }
	        });
	    };
	    /**
	     * Register a callback that listens for a signal.
	     *
	     * The signal can be a simple string (the name for a signal/action), but it
	     * can also be an Object of the form `{data: 'current_value'}` which would
	     * trigger on `data` actions that are sending a JSON dictionary that contains
	     * the key `current_value`. In this case, the value that is
	     * given to the callback function is the value assigned to `current_value`.
	     *
	     * @example
	     * ~~~
	     * d.on('data', value => { console.log(value); });
	     * // If the backend sends an action called 'data' with a message
	     * // {current_value: 3.0}, this function would log `{current_value: 3.0}`.
	     * ~~~
	     *
	     * @example
	     * ~~~
	     * d.on({data: 'current_value'}, value => { console.log(value); });
	     * // If the backend sends an action called 'data' with a
	     * // message {current_value: 3.0}, this function would log `3.0`.
	     * // This callback is not triggered when the message does not contain a
	     * // `current_value` key.
	     * ~~~
	     *
	     * @param  {string|Object}   signal   Signal name to listen for.
	     * @param  {Function}        callback A callback function that takes the attached data.
	     * @return {Connection}      this
	     */
	    Connection.prototype.on = function (signal, callback) {
	        this.onCallbacks.push({ signal: signal, callback: callback });
	        this._onCallbacksOptimized = null;
	        return this;
	    };
	    /**
	     * Emit a signal/action to the backend.
	     * @param  {string}                   signalName A signal name. Usually an action name.
	     * @param  {string|Object|Array|null} message    Payload attached to the action.
	     * @return {Connection}                          this
	     */
	    Connection.prototype.emit = function (signalName, message) {
	        var _this = this;
	        if (this.socket == null || this.socket.readyState !== this.socket.OPEN) {
	            setTimeout(function () { return _this.emit(signalName, message); }, 5);
	            return this;
	        }
	        this.socket.send(JSON.stringify({ signal: signalName, load: message }));
	        return this;
	    };
	    Connection.prototype.onProcess = function (processID, callback) {
	        if (!(processID in this.onProcessCallbacks)) {
	            this.onProcessCallbacks[processID] = [];
	        }
	        this.onProcessCallbacks[processID].push(callback);
	        return this;
	    };
	    return Connection;
	}());
	exports.Connection = Connection;
	//# sourceMappingURL=connection.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var _global = (function() { return this; })();
	var NativeWebSocket = _global.WebSocket || _global.MozWebSocket;
	var websocket_version = __webpack_require__(4);


	/**
	 * Expose a W3C WebSocket class with just one or two arguments.
	 */
	function W3CWebSocket(uri, protocols) {
		var native_instance;

		if (protocols) {
			native_instance = new NativeWebSocket(uri, protocols);
		}
		else {
			native_instance = new NativeWebSocket(uri);
		}

		/**
		 * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
		 * class). Since it is an Object it will be returned as it is when creating an
		 * instance of W3CWebSocket via 'new W3CWebSocket()'.
		 *
		 * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
		 */
		return native_instance;
	}


	/**
	 * Module exports.
	 */
	module.exports = {
	    'w3cwebsocket' : NativeWebSocket ? W3CWebSocket : null,
	    'version'      : websocket_version
	};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(5).version;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = {
		"_args": [
			[
				{
					"raw": "websocket@^1.0.22",
					"scope": null,
					"escapedName": "websocket",
					"name": "websocket",
					"rawSpec": "^1.0.22",
					"spec": ">=1.0.22 <2.0.0",
					"type": "range"
				},
				"/Users/zween/tech/databench_examples/node_modules/databench"
			]
		],
		"_from": "websocket@>=1.0.22 <2.0.0",
		"_id": "websocket@1.0.24",
		"_inCache": true,
		"_location": "/websocket",
		"_nodeVersion": "7.3.0",
		"_npmOperationalInternal": {
			"host": "packages-12-west.internal.npmjs.com",
			"tmp": "tmp/websocket-1.0.24.tgz_1482977757939_0.1858439394272864"
		},
		"_npmUser": {
			"name": "theturtle32",
			"email": "brian@worlize.com"
		},
		"_npmVersion": "3.10.10",
		"_phantomChildren": {},
		"_requested": {
			"raw": "websocket@^1.0.22",
			"scope": null,
			"escapedName": "websocket",
			"name": "websocket",
			"rawSpec": "^1.0.22",
			"spec": ">=1.0.22 <2.0.0",
			"type": "range"
		},
		"_requiredBy": [
			"/databench"
		],
		"_resolved": "https://registry.npmjs.org/websocket/-/websocket-1.0.24.tgz",
		"_shasum": "74903e75f2545b6b2e1de1425bc1c905917a1890",
		"_shrinkwrap": null,
		"_spec": "websocket@^1.0.22",
		"_where": "/Users/zween/tech/databench_examples/node_modules/databench",
		"author": {
			"name": "Brian McKelvey",
			"email": "brian@worlize.com",
			"url": "https://www.worlize.com/"
		},
		"browser": "lib/browser.js",
		"bugs": {
			"url": "https://github.com/theturtle32/WebSocket-Node/issues"
		},
		"config": {
			"verbose": false
		},
		"contributors": [
			{
				"name": "Iñaki Baz Castillo",
				"email": "ibc@aliax.net",
				"url": "http://dev.sipdoc.net"
			}
		],
		"dependencies": {
			"debug": "^2.2.0",
			"nan": "^2.3.3",
			"typedarray-to-buffer": "^3.1.2",
			"yaeti": "^0.0.6"
		},
		"description": "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",
		"devDependencies": {
			"buffer-equal": "^1.0.0",
			"faucet": "^0.0.1",
			"gulp": "git+https://github.com/gulpjs/gulp.git#4.0",
			"gulp-jshint": "^2.0.4",
			"jshint": "^2.0.0",
			"jshint-stylish": "^2.2.1",
			"tape": "^4.0.1"
		},
		"directories": {
			"lib": "./lib"
		},
		"dist": {
			"shasum": "74903e75f2545b6b2e1de1425bc1c905917a1890",
			"tarball": "https://registry.npmjs.org/websocket/-/websocket-1.0.24.tgz"
		},
		"engines": {
			"node": ">=0.8.0"
		},
		"gitHead": "0e15f9445953927c39ce84a232cb7dd6e3adf12e",
		"homepage": "https://github.com/theturtle32/WebSocket-Node",
		"keywords": [
			"websocket",
			"websockets",
			"socket",
			"networking",
			"comet",
			"push",
			"RFC-6455",
			"realtime",
			"server",
			"client"
		],
		"license": "Apache-2.0",
		"main": "index",
		"maintainers": [
			{
				"name": "theturtle32",
				"email": "brian@worlize.com"
			}
		],
		"name": "websocket",
		"optionalDependencies": {},
		"readme": "ERROR: No README data found!",
		"repository": {
			"type": "git",
			"url": "git+https://github.com/theturtle32/WebSocket-Node.git"
		},
		"scripts": {
			"gulp": "gulp",
			"install": "(node-gyp rebuild 2> builderror.log) || (exit 0)",
			"test": "faucet test/unit"
		},
		"version": "1.0.24"
	};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/**
	 * This is a basic set of UI elements to create analyses without having to add
	 * frontend frameworks like Angular or React.
	 *
	 * @module ui
	 */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/**
	 * Abstract class for user interface elements which provides general helpers
	 * to determine the action name from an HTML tag and a way to modify the message
	 * that is sent with actions of wired elements.
	 *
	 * The constructor adds the variables `actionName` and `wireSignal` using
	 * {@link module:ui~UIElement.determineActionName|determineActionName()} and
	 * {@link module:ui~UIElement.determineWireSignal|determineWireSignal()}
	 * respectively.
	 * It also adds `this` UI element to the DOM node at `databenchUI`.
	 */
	var UIElement = (function () {
	    /**
	     * @param  {HTMLElement} node An HTML element.
	     */
	    function UIElement(node) {
	        this.node = node;
	        this.node.databenchUI = this;
	        this.actionName = UIElement.determineActionName(node);
	        this.wireSignal = UIElement.determineWireSignal(node);
	    }
	    /**
	     * Formats the payload of an action.
	     * @param  {any} value Original payload.
	     * @return {any}       Modified payload.
	     */
	    UIElement.prototype.actionFormat = function (value) {
	        return value;
	    };
	    /**
	     * Determine the name of the action that should be associated with the node.
	     *
	     * This can be forced to be `null` by adding a `data-skipwire=true` attribute
	     * to the HTML tag. If that is not found, the action name is determined from
	     * the tag's `data-action`, `name` or `id` attribute (in that order).
	     *
	     * @param  {HTMLElement} node A HTML element.
	     * @return {string}      Name of action or null.
	     */
	    UIElement.determineActionName = function (node) {
	        // determine action name from HTML DOM
	        var action = null;
	        if (node.dataset.skipwire === 'true' ||
	            node.dataset.skipwire === 'TRUE' ||
	            node.dataset.skipwire === '1') {
	            return null;
	        }
	        if (node.dataset.action) {
	            action = node.dataset.action;
	        }
	        else if (node.getAttribute('name')) {
	            action = node.getAttribute('name');
	        }
	        else if (node.getAttribute('id')) {
	            action = node.getAttribute('id');
	        }
	        return action;
	    };
	    /**
	     * Determine the name of the signal that should be listened to from the backend.
	     *
	     * If the HTML tag as a `data-skipwire=true` attribute, this is forced to be
	     * null. Otherwise the signal name is determined from the `data-signal`,
	     * `data-action`, `name` or `id` attribute (in that order.)
	     * For all attributes apart from `data-signal`, the value is wrapped in an
	     * object like `{ data: value-of-attribute }`. The `data-signal` value
	     * can contain a `:` which will be used to create an object as well. That means
	     * that `data-signal="data:myvalue"` gives the same result as `data-action="myvalue"`.
	     *
	     * @param  {HTMLElement} node A HTML element.
	     * @return {string}           Name of a signal or null.
	     */
	    UIElement.determineWireSignal = function (node) {
	        // determine signal name from HTML DOM
	        var signal = null;
	        if (node.dataset.skipwire === 'true' ||
	            node.dataset.skipwire === 'TRUE' ||
	            node.dataset.skipwire === '1') {
	            return null;
	        }
	        if (node.dataset.signal) {
	            signal = node.dataset.signal;
	            if (signal.indexOf(':') >= 1) {
	                var _a = signal.split(':', 2), key = _a[0], value = _a[1];
	                signal = (_b = {}, _b[key] = value, _b);
	            }
	        }
	        else if (node.dataset.action) {
	            signal = { data: node.dataset.action };
	        }
	        else if (node.getAttribute('name')) {
	            signal = { data: node.getAttribute('name') };
	        }
	        else if (node.getAttribute('id')) {
	            signal = { data: node.getAttribute('id') };
	        }
	        return signal;
	        var _b;
	    };
	    return UIElement;
	}());
	exports.UIElement = UIElement;
	/**
	 * Shows all `console.log()` messages and `log` actions from backend.
	 *
	 * Usually wired to a `<pre id="log">` element.
	 */
	var Log = (function (_super) {
	    __extends(Log, _super);
	    /**
	     * @param  {HTMLElement} node     Primary node.
	     * @param  {String} [consoleFnName='log'] Name of console method to replace.
	     * @param  {Number} [limitNumber=20]      Maximum number of messages to show.
	     * @param  {Number} [limitLength=250]     Maximum length of a message.
	     */
	    function Log(node, consoleFnName, limitNumber, limitLength) {
	        if (consoleFnName === void 0) { consoleFnName = 'log'; }
	        if (limitNumber === void 0) { limitNumber = 20; }
	        if (limitLength === void 0) { limitLength = 250; }
	        var _this = _super.call(this, node) || this;
	        _this.consoleFnName = consoleFnName;
	        _this.limitNumber = limitNumber;
	        _this.limitLength = limitLength;
	        _this._messages = [];
	        // more sensible default for this case
	        _this.wireSignal = { log: null };
	        // capture events from frontend
	        var _consoleFnOriginal = console[consoleFnName];
	        console[consoleFnName] = function (message) {
	            _this.add(message, 'frontend');
	            _consoleFnOriginal.apply(console, [message]);
	        };
	        return _this;
	    }
	    Log.prototype.render = function () {
	        var _this = this;
	        while (this._messages.length > this.limitNumber)
	            this._messages.shift();
	        this.node.innerText = this._messages
	            .map(function (m) { return m.join(''); })
	            .map(function (m) { return ((m.length > _this.limitLength)
	            ? m.substr(0, _this.limitLength) + " ..."
	            : m); })
	            .join('\n');
	        return this;
	    };
	    Log.prototype.add = function (message, source) {
	        if (source === void 0) { source = 'unknown'; }
	        var msg = typeof message === 'string' ? message : JSON.stringify(message);
	        var paddedSource = Array(Math.max(0, 8 - source.length)).join(' ') + source;
	        this._messages.push([paddedSource + ": " + msg]);
	        this.render();
	        return this;
	    };
	    /** Wire all logs. */
	    Log.wire = function (conn, root, id, source, consoleFnName, limitNumber, limitLength) {
	        if (id === void 0) { id = 'log'; }
	        if (source === void 0) { source = 'backend'; }
	        if (consoleFnName === void 0) { consoleFnName = 'log'; }
	        if (limitNumber === void 0) { limitNumber = 20; }
	        if (limitLength === void 0) { limitLength = 250; }
	        if (root === undefined)
	            root = document;
	        var node = root.getElementById(id);
	        if (node == null)
	            return;
	        if (UIElement.determineActionName(node) == null)
	            return;
	        console.log('Wiring log to ', node, "with id=" + id + ".");
	        var l = new Log(node, consoleFnName, limitNumber, limitLength);
	        conn.on(l.wireSignal, function (message) { return l.add(message, source); });
	        return;
	    };
	    return Log;
	}(UIElement));
	exports.Log = Log;
	/**
	 * Visual representation of alerts like connection failures.
	 *
	 * Usually wired to a `<div id="databench-alerts">` element.
	 */
	var StatusLog = (function (_super) {
	    __extends(StatusLog, _super);
	    /**
	     * @param  {HTMLElement} node      HTML node.
	     * @param  {function}    formatter Formats a message and a count to a string.
	     */
	    function StatusLog(node, formatter) {
	        if (formatter === void 0) { formatter = StatusLog.defaultAlert; }
	        var _this = _super.call(this, node) || this;
	        _this.formatter = formatter;
	        _this._messages = {};
	        // to avoid confusion, void meaningless parent variable
	        _this.wireSignal = null;
	        return _this;
	    }
	    /**
	     * The default formatter function
	     * @param  {string} msg   A message.
	     * @param  {number} count Count of the message.
	     * @return {string}       HTML formatted version of the inputs.
	     */
	    StatusLog.defaultAlert = function (msg, count) {
	        var countFormat = count <= 1 ? '' : "<b>(" + count + ")</b> ";
	        return "<div class=\"alert alert-danger\">" + countFormat + msg + "</div>";
	    };
	    StatusLog.prototype.render = function () {
	        var _this = this;
	        var formatted = Object.getOwnPropertyNames(this._messages)
	            .map(function (m) { return _this.formatter(m, _this._messages[m]); });
	        this.node.innerHTML = formatted.join('\n');
	        return this;
	    };
	    StatusLog.prototype.add = function (message) {
	        if (message == null) {
	            this._messages = {};
	            return this;
	        }
	        var msg = typeof message === 'string' ? message : JSON.stringify(message);
	        if (this._messages[msg] !== undefined) {
	            this._messages[msg] += 1;
	        }
	        else {
	            this._messages[msg] = 1;
	        }
	        this.render();
	        return this;
	    };
	    /** Wire all status logs. */
	    StatusLog.wire = function (conn, root, id, formatter) {
	        if (id === void 0) { id = 'databench-alerts'; }
	        if (formatter === void 0) { formatter = StatusLog.defaultAlert; }
	        if (root === undefined)
	            root = document;
	        var node = root.getElementById(id);
	        if (node == null)
	            return;
	        if (UIElement.determineActionName(node) == null)
	            return;
	        console.log('Wiring status log', node, "to element with id=" + id + ".");
	        var l = new StatusLog(node, formatter);
	        conn.errorCB = l.add.bind(l);
	    };
	    return StatusLog;
	}(UIElement));
	exports.StatusLog = StatusLog;
	var ButtonState;
	(function (ButtonState) {
	    ButtonState[ButtonState["Idle"] = 1] = "Idle";
	    ButtonState[ButtonState["Active"] = 2] = "Active";
	})(ButtonState = exports.ButtonState || (exports.ButtonState = {}));
	/**
	 * A button, and usually wired to any `<button>` with an action name.
	 *
	 * This button also binds to process IDs of the backend. That means
	 * that the button is disabled (using the CSS class `disabled`) while the
	 * backend is processing the action that got started when it was clicked.
	 * A simple example is below.
	 *
	 * @example
	 * ~~~
	 * // in index.html, add:
	 * <button data-action="run">Run</button>
	 *
	 * // in analysis.py, add:
	 * def on_run(self):
	 *     """Run when button is pressed."""
	 *     pass
	 *
	 * // In this form, Databench finds the button automatically and connects it
	 * // to the backend. No additional JavaScript code is required.
	 * ~~~
	 */
	var Button = (function (_super) {
	    __extends(Button, _super);
	    /**
	     * @param  {HTMLElement} node DOM node to connect.
	     */
	    function Button(node) {
	        var _this = _super.call(this, node) || this;
	        _this._state = ButtonState.Idle;
	        _this.node.addEventListener('click', _this.click.bind(_this), false);
	        return _this;
	    }
	    /**
	     * Called on click events. When a button is wired, this function is overwritten
	     * with the actual function that is triggered on click events.
	     * @param  {int} processID a random id for the process that could be started
	     */
	    Button.prototype.clickCB = function (processID) {
	        return console.log("click on " + this.node + " with " + processID);
	    };
	    Button.prototype.render = function () {
	        switch (this._state) {
	            case ButtonState.Active:
	                this.node.classList.add('disabled');
	                break;
	            default:
	                this.node.classList.remove('disabled');
	        }
	        return this;
	    };
	    Button.prototype.click = function () {
	        if (this._state !== ButtonState.Idle)
	            return this;
	        var processID = Math.floor(Math.random() * 0x100000);
	        this.clickCB(processID);
	        return this;
	    };
	    Button.prototype.state = function (s) {
	        if (s !== ButtonState.Idle && s !== ButtonState.Active)
	            return this;
	        this._state = s;
	        this.render();
	        return this;
	    };
	    /** Wire all buttons. */
	    Button.wire = function (conn, root) {
	        if (root === undefined)
	            root = document;
	        [].slice.call(root.getElementsByTagName('BUTTON'), 0)
	            .filter(function (node) { return node.databenchUI === undefined; })
	            .filter(function (node) { return UIElement.determineActionName(node) !== null; })
	            .forEach(function (node) {
	            var b = new Button(node);
	            console.log('Wiring button', node, "to action " + b.actionName + ".");
	            // set up click callback
	            b.clickCB = function (processID) {
	                // set up process callback
	                conn.onProcess(processID, function (status) { return b.state(
	                // map process status to state
	                { start: ButtonState.Active, end: ButtonState.Idle }[status]); });
	                conn.emit(b.actionName, b.actionFormat({
	                    __process_id: processID,
	                }));
	            };
	        });
	    };
	    return Button;
	}(UIElement));
	exports.Button = Button;
	/**
	 * Data bound text elements.
	 *
	 * Wired to ``<span>``, ``<p>``, ``<div>``, ``<i>`` and ``<b>`` tags with a
	 * ``data-action`` attribute specifying the action name.
	 */
	var Text = (function (_super) {
	    __extends(Text, _super);
	    function Text() {
	        return _super.apply(this, arguments) || this;
	    }
	    /**
	     * Format the value.
	     * @param  {any} value Value as represented in the backend.
	     * @return {string}       Formatted representation of the value.
	     */
	    Text.prototype.formatFn = function (value) {
	        return value;
	    };
	    /** Reads and sets the value. */
	    Text.prototype.value = function (v) {
	        if (v === undefined)
	            return this.node.innerHTML;
	        this.node.innerHTML = this.formatFn(v || '');
	        return this;
	    };
	    /**
	     * Wire all text.
	     * @param  {Connection} conn Connection to use.
	     */
	    Text.wire = function (conn, root) {
	        if (root === undefined)
	            root = document;
	        [].concat([].slice.call(root.getElementsByTagName('SPAN'), 0), [].slice.call(root.getElementsByTagName('P'), 0), [].slice.call(root.getElementsByTagName('DIV'), 0), [].slice.call(root.getElementsByTagName('I'), 0), [].slice.call(root.getElementsByTagName('B'), 0))
	            .filter(function (node) { return node.databenchUI === undefined; })
	            .filter(function (node) { return node.dataset['action'] !== undefined; })
	            .filter(function (node) { return UIElement.determineActionName(node) !== null; })
	            .forEach(function (node) {
	            var t = new Text(node);
	            console.log('Wiring text', node, "to action " + t.actionName + ".");
	            // handle events from backend
	            conn.on(t.wireSignal, function (message) { return t.value(message); });
	        });
	    };
	    return Text;
	}(UIElement));
	exports.Text = Text;
	/** Make an `<input[type='text']>` with an action name interactive. */
	var TextInput = (function (_super) {
	    __extends(TextInput, _super);
	    /**
	     * @param {HTMLElement} node The node to connect.
	     */
	    function TextInput(node) {
	        var _this = _super.call(this, node) || this;
	        _this._triggerOnKeyUp = false;
	        _this.node.addEventListener('change', _this.change.bind(_this), false);
	        return _this;
	    }
	    /**
	     * Format the value.
	     * @param  {any}    value Value as represented in the backend.
	     * @return {string}       Formatted representation of the value.
	     */
	    TextInput.prototype.formatFn = function (value) {
	        return value;
	    };
	    /**
	     * Callback that is triggered on frontend changes.
	     * @param  {any} value A formatted action.
	     */
	    TextInput.prototype.changeCB = function (value) {
	        return console.log("change of " + this.node + ": " + value);
	    };
	    TextInput.prototype.change = function () {
	        return this.changeCB(this.actionFormat(this.value()));
	    };
	    /**
	     * The default is `false`, which means that the callback is only triggered on
	     * `change` events (i.e. pressing enter or unfocusing the element).
	     * Setting this to true will trigger on every `keyup` event of this element.
	     *
	     * @param  {boolean}   v Whether to trigger on `keyup` events. Default is true.
	     * @return {TextInput}   self
	     */
	    TextInput.prototype.triggerOnKeyUp = function (v) {
	        if (v !== false && !this._triggerOnKeyUp) {
	            this.node.addEventListener('keyup', this.change.bind(this), false);
	            this._triggerOnKeyUp = true;
	        }
	        if (v === false && this._triggerOnKeyUp) {
	            this.node.removeEventListener('keyup', this.change.bind(this), false);
	            this._triggerOnKeyUp = false;
	        }
	        return this;
	    };
	    /** Reads and sets the value. */
	    TextInput.prototype.value = function (v) {
	        if (v === undefined)
	            return this.node.value;
	        this.node.value = this.formatFn(v || '');
	        return this;
	    };
	    /** Wire all text inputs. */
	    TextInput.wire = function (conn, root) {
	        if (root === undefined)
	            root = document;
	        [].slice.call(root.getElementsByTagName('INPUT'), 0)
	            .filter(function (node) { return node.databenchUI === undefined; })
	            .filter(function (node) { return node.getAttribute('type') === 'text'; })
	            .filter(function (node) { return UIElement.determineActionName(node) !== null; })
	            .forEach(function (node) {
	            var t = new TextInput(node);
	            console.log('Wiring text input', node, "to action " + t.actionName + ".");
	            // handle events from frontend
	            t.changeCB = function (message) { return conn.emit(t.actionName, message); };
	            // handle events from backend
	            conn.on(t.wireSignal, function (message) { return t.value(message); });
	        });
	    };
	    return TextInput;
	}(UIElement));
	exports.TextInput = TextInput;
	/**
	 * Make all `<input[type='range']>` with an action name interactive.
	 *
	 * @example
	 * ~~~
	 * // in index.html, add:
	 * <label for="samples">Samples:</label>
	 * <input type="range" id="samples" value="1000" min="100" max="10000" step="100" />
	 *
	 * // in analysis.py, add:
	 * def on_samples(self, value):
	 *     """Sets the number of samples to generate per run."""
	 *     self.data['samples'] = value
	 *
	 * // The Python code is for illustration only and can be left out as this is
	 * // the default behavior.
	 * ~~~
	 */
	var Slider = (function (_super) {
	    __extends(Slider, _super);
	    /**
	     * @param  {HTMLElement}  node      DOM node to bind.
	     * @param  {HTMLElement?} labelNode DOM node label that corresponds to the slider.
	     */
	    function Slider(node, labelNode) {
	        var _this = _super.call(this, node) || this;
	        _this.labelNode = labelNode;
	        _this.labelHtml = labelNode ? labelNode.innerHTML : null;
	        _this.node.addEventListener('input', _this.render.bind(_this), false);
	        _this.node.addEventListener('change', _this.change.bind(_this), false);
	        _this.render();
	        return _this;
	    }
	    /**
	     * Callback with changes to the slider value.
	     * @param  {Number} value   Value from a sliderToValue() transform.
	     */
	    Slider.prototype.changeCB = function (value) {
	        return console.log("slider value change: " + value);
	    };
	    /**
	     * Transform a backend value to a slider value.
	     * @param  {number} value Value as stored in backend.
	     * @return {int}          Value for the HTML range element.
	     */
	    Slider.prototype.valueToSlider = function (value) {
	        return value;
	    };
	    /**
	     * Transform a value from the HTML range element to a value that should be stored.
	     * @param  {int}    s Value from HTML range element.
	     * @return {number}   Value to store.
	     */
	    Slider.prototype.sliderToValue = function (s) {
	        return s;
	    };
	    /**
	     * How a value should be represented.
	     * For example, this can add units or convert from radians to degrees.
	     * @param  {number}         value Input value as it is stored in the backend.
	     * @return {string|number}        Representation of a value.
	     */
	    Slider.prototype.formatFn = function (value) {
	        return value;
	    };
	    Slider.prototype.render = function () {
	        var v = this.value();
	        if (this.labelNode) {
	            this.labelNode.innerHTML = this.labelHtml + " " + this.formatFn(v);
	        }
	        return this;
	    };
	    /** Reads and sets the value. */
	    Slider.prototype.value = function (v) {
	        if (v === undefined) {
	            return this.sliderToValue(parseFloat(this.node.value));
	        }
	        var newSliderValue = this.valueToSlider(v);
	        if (this.node.value === newSliderValue)
	            return this;
	        this.node.value = newSliderValue;
	        this.render();
	        return this;
	    };
	    Slider.prototype.change = function () {
	        return this.changeCB(this.actionFormat(this.value()));
	    };
	    /** Find all labels for slider elements. */
	    Slider.labelsForSliders = function (root) {
	        var map = {};
	        [].slice.call(root.getElementsByTagName('LABEL'), 0)
	            .filter(function (label) { return label.htmlFor; })
	            .forEach(function (label) {
	            map[label.htmlFor] = label;
	        });
	        return map;
	    };
	    /** Wire all sliders. */
	    Slider.wire = function (conn, root) {
	        if (root === undefined)
	            root = document;
	        var lfs = this.labelsForSliders(root);
	        [].slice.call(root.getElementsByTagName('INPUT'), 0)
	            .filter(function (node) { return node.databenchUI === undefined; })
	            .filter(function (node) { return node.getAttribute('type') === 'range'; })
	            .filter(function (node) { return UIElement.determineActionName(node) !== null; })
	            .forEach(function (node) {
	            var slider = new Slider(node, lfs[node.id]);
	            console.log('Wiring slider', node, "to action " + slider.actionName + ".");
	            // handle events from frontend
	            slider.changeCB = function (message) { return conn.emit(slider.actionName, message); };
	            // handle events from backend
	            conn.on(slider.wireSignal, function (message) { return slider.value(message); });
	        });
	    };
	    return Slider;
	}(UIElement));
	exports.Slider = Slider;
	/**
	 * Connect an `<img>` with a signal name to the backend.
	 *
	 * The signal message is placed directly into the `src` attribute of the image
	 * tag. For matplotlib, that formatting can be done with the utility function
	 * `fig_to_src()` (see example below).
	 *
	 * @example
	 * ~~~
	 * // in index.html, add
	 * <img alt="my plot" data-signal="mpl" />
	 *
	 * // in analysis.py, add
	 * import matplotlib.pyplot as plt
	 * ...
	 * fig = plt.figure()
	 * ...
	 * self.emit('mpl', databench.fig_to_src(fig))
	 * ~~~
	 */
	var Image = (function (_super) {
	    __extends(Image, _super);
	    function Image() {
	        return _super.apply(this, arguments) || this;
	    }
	    /** Reads and sets the value. */
	    Image.prototype.value = function (v) {
	        if (v === undefined)
	            return this.node.src;
	        this.node.src = v || '';
	        return this;
	    };
	    /** Wire all text inputs. */
	    Image.wire = function (conn, root) {
	        if (root === undefined)
	            root = document;
	        [].slice.call(root.getElementsByTagName('IMG'), 0)
	            .filter(function (node) { return node.databenchUI === undefined; })
	            .filter(function (node) { return node.dataset['signal'] !== undefined; })
	            .filter(function (node) { return UIElement.determineWireSignal(node) !== null; })
	            .forEach(function (node) {
	            var img = new Image(node);
	            console.log('Wiring image', node, "to signal " + img.wireSignal + ".");
	            // handle events from backend
	            conn.on(img.wireSignal, function (message) { return img.value(message); });
	        });
	    };
	    return Image;
	}(UIElement));
	exports.Image = Image;
	/**
	 * Wire all the UI elements to the backend. The action name is determined by
	 * {@link module:ui~UIElement.determineActionName|UIElement.determineActionName()}
	 * and the action message can be modified by overwriting
	 * {@link module:ui~UIElement#actionFormat|UIElement.actionFormat()}. The signal
	 * name is determined by
	 * {@link module:ui~UIElement.determineWireSignal|UIElement.determineWireSignal()}.
	 *
	 * @param  {Connection} connection A Databench.Connection instance.
	 * @return {Connection}            The same connection.
	 */
	function wire(connection, root) {
	    StatusLog.wire(connection, root);
	    Button.wire(connection, root);
	    TextInput.wire(connection, root);
	    Text.wire(connection, root);
	    Slider.wire(connection, root);
	    Image.wire(connection, root);
	    Log.wire(connection, root);
	    return connection;
	}
	exports.wire = wire;
	//# sourceMappingURL=ui.js.map

/***/ })
/******/ ]);