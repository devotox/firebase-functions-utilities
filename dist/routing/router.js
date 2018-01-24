'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (route, routes) {
	routes = _extends({}, defaultRoutes, routes);
	routes[route] && routes[route]();
	routes.__status__(route);
	return router;
};

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _status = require('./api/status');

var _status2 = _interopRequireDefault(_status);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express2.default.Router();

var defaultRoutes = {
	__status__: function __status__(route) {
		router.use('/:' + route + '?/status', _status2.default);
	}
};

;