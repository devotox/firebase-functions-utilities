'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (prefix, routes) {
	var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	    _ref$root = _ref.root,
	    root = _ref$root === undefined ? process.cwd() : _ref$root,
	    _ref$status = _ref.status,
	    status = _ref$status === undefined ? true : _ref$status,
	    _ref$proxy = _ref.proxy,
	    proxy = _ref$proxy === undefined ? false : _ref$proxy;

	createRoutes(prefix, routes, root);

	status && statusRoute(prefix);
	proxy && proxyRoute(prefix);

	return router;
};

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _proxy = require('./api/proxy');

var _proxy2 = _interopRequireDefault(_proxy);

var _status = require('./api/status');

var _status2 = _interopRequireDefault(_status);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express2.default.Router();

var statusRoute = function statusRoute(prefix) {
	router.use('/:' + prefix + '?/status', _status2.default);
};

var proxyRoute = function proxyRoute(prefix) {
	router.use('/:' + prefix + '?/proxy', _proxy2.default);
};

var createRoutes = function createRoutes(prefix, routes, root) {
	routes.forEach(function (route) {
		return router.use('/:' + prefix + '?/' + route, require(root + '/' + prefix + '/' + route));
	});
};

;