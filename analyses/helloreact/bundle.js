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
/***/ function(module, exports) {

	/* global Databench */
	/* global document */
	/* global React */
	/* global ReactDOM */

	// Alternatively, this would add React into the bundle, but that takes
	// longer to to build which is annoying during development:
	// let React = require('react');
	// let ReactDOM = require('react-dom');


	class StatusText extends React.Component {
	  constructor(props) {
	    super(props);
	    this.state = {
	      status: 'initial status'
	    };
	  }

	  componentDidMount() {
	    this.props.databench.on('data', data => {
	      this.setState(data);
	      this.props.databench.emit('ack', [data]);
	    });
	  }

	  render() {
	    return React.createElement(
	      'p',
	      null,
	      'Status: ',
	      this.state.status
	    );
	  }
	}

	StatusText.propTypes = {
	  databench: React.PropTypes.shape({
	    emit: React.PropTypes.function,
	    on: React.PropTypes.function
	  })
	};

	const databench = new Databench.Connection();
	Databench.ui.wire(databench);
	ReactDOM.render(React.createElement(StatusText, { databench: databench }), document.getElementById('example'));
	databench.connect();

/***/ }
/******/ ]);